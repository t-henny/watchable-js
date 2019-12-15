export interface IStateChange<T> {
  currentState: T;
  futureState: T;
  target: any;
  key: symbol | string | number;
  newProp?: PropertyDescriptor;
}