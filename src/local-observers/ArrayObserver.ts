import { IObserver } from "../lib/exports";
import { IFutureChange } from "../lib/interfaces/IFutureChange";

const isEqual = require('lodash.isequal');


export class ArrayObserver implements IObserver<IFutureChange<any[]>> {
  preUpdate(data: IFutureChange<any[]>) {
    console.log(`Array will update to ${data.futureValue} from ${data.currentValue}`);

    // Check if only the order has changed (inefficient check :o)
    const sortedOrigArray = data.currentValue.concat().sort();
    const sortedFutureArray = data.futureValue.concat().sort();
    if (isEqual(sortedOrigArray, sortedFutureArray)) {
      console.log("Array order changed.")
    }
  }

}