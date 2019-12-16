import { ISubject } from "./interfaces/ISubject";
import { IObserver } from "./interfaces/IObserver";
import { DeepCopy } from "./DeepCopy";
import { ObjectTraverse } from "./ObjectTraverse";
import { IStateChange } from "./interfaces/IStateChange";
import { IFutureChange } from "./interfaces/IFutureChange";

const PARENT_SIGNATURE = "__parent__";
const PARENT_KEY_SINGATURE = "__parent_key__";

export class Watcher<T extends object> implements ISubject<IStateChange<T>> {
  private _observers: Set<IObserver<IStateChange<T>>> = new Set();
  private _obj: T;

  constructor(obj: T) {
    this._obj = this.createTraversedWatcherProxy(obj);
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

  private createSingularWatcherProxy(obj: any) {
    const thisWatcher = this;
    return new Proxy(obj, {
      set: function (target, key, value, receiver) {
        let valueToSet = value;
        if (key !== PARENT_SIGNATURE && key !== PARENT_KEY_SINGATURE) {
          valueToSet = thisWatcher.createTraversedWatcherProxy(value, target, key as any);
          const copies = Watcher.createCurrentFutureCopies(thisWatcher.data, target, key, value);
          thisWatcher.notifyObserversOfChange({
            currentState: copies.currentValue,
            futureState: copies.futureValue,
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

  private createTraversedWatcherProxy(val: any, parentObj?: any, parentKey?: string | number) {
    if (typeof val === "object") {
      ObjectTraverse.traverse(val, (obj, key) => {
        if (typeof obj[key] === "object") {
          obj[key] = this.createSingularWatcherProxy(obj[key]);
          obj[key][PARENT_SIGNATURE] = obj;
          obj[key][PARENT_KEY_SINGATURE] = key;
        }
      });
      val[PARENT_SIGNATURE] = parentObj;
      val[PARENT_KEY_SINGATURE] = parentKey;
      return this.createSingularWatcherProxy(val);
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

  private static createCurrentFutureCopies(rootObj: any, target: any, key: any, targetValue: any): IFutureChange<any> {
    const currentValue = DeepCopy(rootObj);
    const futureValue = DeepCopy(rootObj);

    const keyChain = Watcher.createKeyChainToTarget(target);

    let traversableNew = futureValue;
    for (const curKey of keyChain) {
      traversableNew = traversableNew[curKey];
    }
    traversableNew[key] = targetValue;

    return { currentValue, futureValue };
  }
}
