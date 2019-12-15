import { Watcher } from "./lib/Watcher";

// Array Watcher with Hooks
const arrayState = new Watcher([1,2,3,4]);
arrayState.data.push(1);

// Sub Array Watcher with Hooks
const subArrayState = new Watcher({ arr: [3,2,1]});
subArrayState.subscribe({
  preUpdate: (x) => {console.log(x)},
});
subArrayState.data.arr.sort();

const obj: {[key: string]: any} = {};
obj["test"] = 5;

const watcher = new Watcher(obj);
watcher.subscribe({
  preUpdate: (x) => console.log(x)
});
watcher.data["NEW"] = { test2: 50 };

const advancedWatcher = new Watcher({
  child1: {
    furtherChild: {
      grand: 50
    }
  }
});
advancedWatcher.subscribe({
  preUpdate: (x) => console.log(x)
})
advancedWatcher.data.child1.furtherChild.grand = 50;