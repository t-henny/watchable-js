import { IObserver, IStateChange } from "../lib/exports";

export class BaseObserver implements IObserver<IStateChange<any>> {

  private printObjectRootMap(keyChain: string[], sourceKey: any) {
    return `[ * > ${(keyChain.reduce((pre, cur) => pre + cur  + " > ", ""))}${sourceKey} ]`;
  }

  preUpdate(data: IStateChange<any>) {
    if (data.isPropNew) {
      console.log(`Key added: ${this.printObjectRootMap(data.keyChain, (data.key as any) + " (new)")}`);
    } else {
      console.log(`Value changed at ${this.printObjectRootMap(data.keyChain, data.key)}`);
    }
  }
  
}