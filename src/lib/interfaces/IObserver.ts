import { IStateChange } from "./IStateChange";

export interface IObserver<T> {
  preUpdate(stateChange: IStateChange<T>): any;
}
