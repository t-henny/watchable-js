export interface IObserver<T> {
  preUpdate(data: T): any;
}
