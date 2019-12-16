import { ISubject } from "./interfaces/ISubject";
import { IObserver } from "./interfaces/IObserver";
import { DeepCopy } from "./DeepCopy";
import { ObjectTraverse } from "./ObjectTraverse";
import { IStateChange } from "./interfaces/IStateChange";

const PARENT_SIGNATURE = "__parent__";
const PARENT_KEY_SINGATURE = "__parent_key__";

interface IOldNew {
  old: any;
  new: any;
}

export class Watcher<T extends object> implements ISubject<IStateChange<T>> {
  private _observers: Set<IObserver<IStateChange<T>>> = new Set();
  private _obj: T;

  constructor(obj: T) {
    this._obj = this.createObjectProxies(obj);
  }

  get data() {
    return this._obj;
  }

  subscribe(observer: IObserver<IStateChange<T>>) {
    this._observers.add(observer);
  }

  unsubscribe(observer: IObserver<IStateChange<T>>) {
    this._observers.add(observer);
  }

  clearSubscriptions() {
    this._observers.clear();
  }

  private notifyObserversOfChange(stateChange: IStateChange<T>) {
    this._observers.forEach(obs => obs.preUpdate(stateChange));
  }

  private createProxy(obj: any) {
    const thisWatcher = this;
    return new Proxy(obj, {
      set: function (target, key, value, receiver) {
        let valueToSet = value;
        if (key !== PARENT_SIGNATURE && key !== PARENT_KEY_SINGATURE) {
          valueToSet = thisWatcher.createObjectProxies(value, target, key as any);
          const copies = Watcher.createOldNewCopies(thisWatcher.data, target, key, value);
          thisWatcher.notifyObserversOfChange({
            currentState: copies.old,
            futureState: copies.new,
            target,
            key,
            currentValue: target[key],
            futureValue: value,
            isPropNew: !target.hasOwnProperty(key),
            keyChain: Watcher.createKeyChainToTarget(target)
          });
        }
        return Reflect.set(target, key, valueToSet, receiver);
      },
      defineProperty(target, key, descriptor) {
        if (key === PARENT_SIGNATURE || key === PARENT_KEY_SINGATURE) {
          return Reflect.defineProperty(target, key, {
            ...descriptor,
            enumerable: false
          });
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    });
  }

  private createObjectProxies(val: any, parentObj?: any, parentKey?: string | number) {
    if (typeof val === "object") {
      ObjectTraverse.traverse(val, (obj, key) => {
        if (typeof obj[key] === "object") {
          obj[key] = this.createProxy(obj[key]);
          obj[key][PARENT_SIGNATURE] = obj;
          obj[key][PARENT_KEY_SINGATURE] = key;
        }
      });
      val[PARENT_SIGNATURE] = parentObj;
      val[PARENT_KEY_SINGATURE] = parentKey;
      return this.createProxy(val);
    }
    return val;
  }

  private static createKeyChainToTarget(target: any) {
    let traversableRoot = target;
    const keyChain: string[] = [];
    while (traversableRoot[PARENT_SIGNATURE] && traversableRoot[PARENT_KEY_SINGATURE]) {
      keyChain.push(traversableRoot[PARENT_KEY_SINGATURE]);
      traversableRoot = traversableRoot[PARENT_SIGNATURE];
    }

    return keyChain.reverse();
  }

  private static createOldNewCopies(rootObj: any, target: any, key: any, value: any): IOldNew {
    const oldValue = DeepCopy(rootObj);
    const newValue = DeepCopy(rootObj);

    const keyChain = Watcher.createKeyChainToTarget(target);

    let traversableNew = newValue;
    for (const curKey of keyChain) {
      traversableNew = traversableNew[curKey];
    }
    traversableNew[key] = value;

    return {
      old: oldValue,
      new: newValue
    };
  }
}
