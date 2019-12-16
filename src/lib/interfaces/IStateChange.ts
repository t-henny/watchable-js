import { IFutureChange } from "./IFutureChange";
import { IPropertyMutation } from "./IOptionalPropertyAddition";

export interface IStateChange<T> extends IFutureChange<any>, IPropertyMutation {
  currentState: T;
  futureState: T;
  target: any;
  keyChain: string[];
}