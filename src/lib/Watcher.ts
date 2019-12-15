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

const isEqual = require('lodash.isequal');

export class Watcher<T extends object> implements ISubject<T> {
  private _observers: Set<IObserver<T>> = new Set();
  private _obj: T;

  constructor(obj: T) {
    this.createSubWatchers(obj);

    this._obj = this.createProxy(obj);
  }

  get data() {
    return this._obj;
  }

  subscribe(observer: IObserver<T>) {
    this._observers.add(observer);
  }

  unsubscribe(observer: IObserver<T>) {
    this._observers.add(observer);
  }

  private notifyObserversOfChange(stateChange: IStateChange<T>) {
    if (!isEqual(stateChange.futureState, stateChange.currentState)) {
      this._observers.forEach(obs => obs.preUpdate(stateChange));
    }
  }

  private createProxy(obj: any) {
    const thisWatcher = this;
    return new Proxy(obj, {
      set: function (target, key, value, receiver) {
        if (key !== PARENT_SIGNATURE && key !== PARENT_KEY_SINGATURE) {
          const copies = Watcher.createOldNewCopies(thisWatcher.data, target, key, value);
          thisWatcher.notifyObserversOfChange({
            currentState: copies.old,
            futureState: copies.new,
            target,
            key
          });
        }
        return Reflect.set(target, key, value, receiver);
      },
      defineProperty(target, key, descriptor) {
        if (key !== PARENT_SIGNATURE && key !== PARENT_KEY_SINGATURE) {
          const copies = Watcher.createOldNewCopies(thisWatcher.data, target, key, descriptor.value);
          thisWatcher._observers.forEach(x => x.preUpdate({
            target,
            key,
            newProp: descriptor,
            currentState: copies.old,
            futureState: copies.new
          }));
        } else {
          return Reflect.defineProperty(target, key, {
            ...descriptor,
            enumerable: false
          });
        }
        return Reflect.defineProperty(target, key, descriptor);
      }
    });
  }

  private createSubWatchers(val: any) {
    if (typeof val === "object") {
      ObjectTraverse.traverse(val, (obj, key) => {
        if (typeof obj[key] === "object") {
          obj[key] = this.createProxy(obj[key]);
          obj[key][PARENT_SIGNATURE] = obj;
          obj[key][PARENT_KEY_SINGATURE] = key;
        }
      });
    }
  }

  private static createOldNewCopies(rootObj: any, target: any, key: any, value: any): IOldNew {
    const oldValue = DeepCopy(rootObj);
    const newValue = DeepCopy(rootObj);

    let traversableRoot = target;
    const keyChain: string[] = [];
    while (traversableRoot[PARENT_SIGNATURE] && traversableRoot[PARENT_KEY_SINGATURE]) {
      keyChain.push(traversableRoot[PARENT_KEY_SINGATURE]);
      traversableRoot = traversableRoot[PARENT_SIGNATURE];
    }

    keyChain.reverse();
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
