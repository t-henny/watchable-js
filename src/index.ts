import { Watcher } from "./lib/exports";
import { ArrayObserver } from "./local-observers/ArrayObserver";
import { LiteralObserver } from "./local-observers/LiteralObserver";
import { ObjectObserver } from "./local-observers/ObjectObserver";
import { BaseObserver } from "./local-observers/BaseObserver";

// Create the Watcher
let watcher = new Watcher({
  arr: [4,3,2],
  obj: {
    instantiateKey: 300
  } as { [key: string]: any },
  stringLit: "string-lit",
  numLit: 99,
  boolLit: false
});

// Define the different sub-observers (will be used later)
const baseObserver = new BaseObserver();
const arrayObserver = new ArrayObserver();
const literalObserver = new LiteralObserver();
const objectObserver = new ObjectObserver();

// Subscribe Observers
watcher.subscribe({
  preUpdate: (stateChange) => {
    // Print information independent of type
    baseObserver.preUpdate(stateChange);

    // Pass data to observers if type is valid
    if (Array.isArray(stateChange.currentValue) || Array.isArray(stateChange.futureValue)) {
      arrayObserver.preUpdate(stateChange);
    } else if (
      typeof stateChange.currentValue === "number" || typeof stateChange.futureState === "number" ||
      typeof stateChange.currentValue === "string" || typeof stateChange.futureState === "string" ||
      typeof stateChange.currentValue === "boolean" || typeof stateChange.futureState === "boolean"
    ) {
      literalObserver.preUpdate(stateChange);
    }

    if (typeof stateChange.currentValue === "object" || typeof stateChange.futureValue === "object") {
      objectObserver.preUpdate(stateChange);
    } 
  }
});




// Test Library
console.log("\n\n")
console.log("-----------------------------");
console.log("||   Start Array Changes    |")
console.log("-----------------------------");

console.log("Executing: watcher.data.arr[1] = 44;");
watcher.data.arr[1] = 44;
console.log("\n");

console.log("Executing: watcher.data.arr.push(4);");
watcher.data.arr.push(4);
console.log("\n");

console.log("Executing: watcher.data.arr = [9,8,7];");
watcher.data.arr = [9,8,7];
console.log("\n");

console.log("Executing: watcher.data.arr[2] = 99;");
watcher.data.arr[2] = 99;
console.log("\n");

console.log("-----------------------------");
console.log("||    End Array Changes    ||")
console.log("-----------------------------");
console.log("\n\n")







console.log("\n\n")
console.log("-----------------------------");
console.log("||   Start Object Changes    |")
console.log("-----------------------------");

console.log("Executing: watcher.data.obj.instantiateKey = 42;");
watcher.data.obj.instantiateKey = 42;
console.log("\n");

console.log("Executing: watcher.data.obj.newObj = { objChild: \"test\" };");
watcher.data.obj.newObj = { objChild: { grandChild: "INFO" } };
console.log("\n");

console.log("Executing: watcher.data.obj.newObj.objChild.grandChild = \"New Value\";");
watcher.data.obj.newObj.objChild.grandChild = "New Value";
console.log("\n");

console.log("Executing: watcher.data.obj.newObj.objChild = { different: 33 };");
watcher.data.obj.newObj.objChild = { different: 33 };
console.log("\n");

console.log("-----------------------------");
console.log("||    End Object Changes    ||")
console.log("-----------------------------");
console.log("\n\n")







console.log("\n\n")
console.log("-----------------------------");
console.log("||   Start Literal Changes    |")
console.log("-----------------------------");

console.log("Executing: watcher.data.numLit = 256;");
watcher.data.numLit = 256;
console.log("\n");

console.log("Executing: watcher.data.stringLit = \"Some Brand New String!\";");
watcher.data.stringLit = "Some Brand New String!";
console.log("\n");

console.log("Executing: watcher.data.boolLit = true;");
watcher.data.boolLit = true;
console.log("\n");

console.log("-----------------------------");
console.log("||    End Literal Changes    ||")
console.log("-----------------------------");
console.log("\n\n")