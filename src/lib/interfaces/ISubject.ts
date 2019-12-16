import { IObserver } from "./IObserver";

export interface ISubject<T> {
  subscribe(observer: IObserver<T>): any;
  unsubscribe(observer: IObserver<T>): any;
}
