# watchable-js
Detect state change of custom objects and call registered observers.

Will traverse and watch the entire object chain. If new fields are added after the fact, they too will be watched.

Includes a simple `index.html` file that demos the library via console logs.

Note: This is more of a personal project than anything. There are probably other packages that accomplish this better than here 🤷.

## Getting started
First, add the library to your project.

```bash
npm i watchable-js
```

The import the Watcher in your project.

```ts
import { Watcher } from "watchable-js";
```

Then, create a watcher for whatever your state is (can really be anything, so long as the root type is "object").

```ts
let watcher = new Watcher({...});
```

## Example

Below is a brief example of how to create a watcher, register observers and see it in action.

```ts
import { Watcher } from "./lib/exports";

// Create the Watcher
let watcher = new Watcher({
  obj: {
    child: 300
  }
});

// Lets create a helper method for printing the object chain (you'll see why shortly).
const printObjectRootMap = (keyChain: string[], sourceKey: any) => {
  return `[ * > ${(keyChain.reduce((pre, cur) => pre + cur  + " > ", ""))}${sourceKey} ]`;
}
  
// Create and register an Observer
watcher.subscribe({
  preUpdate: (stateChange) => {
    console.log(`Value changed at ${printObjectRootMap(stateChange.keyChain, stateChange.key)} from ${stateChange.currentValue} to ${stateChange.futureValue}`);
    // Do more logic here! Check out the IStateChange type to see all available options! 
  }
});

// Apply a change to the Watcher's data
watcher.data.obj.child = 450;

// "Value changed at [ * > obj > child ] from 300 to 450" Will be logged to the console.
```

That's pretty much it! You can do some fancier things as well, such as traversing changes to root. To see that in action refer to the Watcher.ts file itself or the index.ts file. (Hint: look `keyChain` prop of `IStateChange`).

## Contributing & Testing (Repo Only)
First, clone and go into the repo:

```bash
cd watchable-js
```

Then, do an NPM install.

```bash
npm install
```

After which, 
