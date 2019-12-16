import { IObserver } from "../lib/exports";
import { IFutureChange } from "../lib/interfaces/IFutureChange";

export class LiteralObserver implements IObserver<IFutureChange<number | string | boolean>> {
  preUpdate(data: IFutureChange<string | number | boolean>) {
    console.log(`A literal of type ${typeof data.currentValue} with value ${data.currentValue} will be updated to ${data.futureValue}.`);
  }

}