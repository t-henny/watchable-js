import { IObserver } from "../lib/exports";
import { IFutureChange } from "../lib/interfaces/IFutureChange";

export class ObjectObserver implements IObserver<IFutureChange<object>> {
  preUpdate(data: IFutureChange<object>) {
    if (data.currentValue !== data.futureValue) {
      console.log(`The value of an object changed from ${data.currentValue?.toString()} to ${data.futureValue?.toString()}`);
    }
  }
}