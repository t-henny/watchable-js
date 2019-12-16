export const DeepCopy = (
  obj: any,
  objectMap: Map<any, any> = new Map(),
  newObj: { [key: string]: any } = {}
): any => {
  if (Array.isArray(obj)) {
    return obj.map(x => DeepCopy(x, objectMap));
  } else if (typeof obj === "object") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Only conintue if not cyclical
        if (!objectMap.has(obj[key])) {
          objectMap.set(obj[key], {});

          newObj[key] = DeepCopy(obj[key], objectMap);

          objectMap.set(obj[key], newObj);

          // This may seem redundent (and there is probably a better way)
          // But this is the onyl sure fire way to know that the object was
          // copied with all cyclical relationships established
          newObj[key] = DeepCopy(obj[key], objectMap);
        } else {
          // It's a cycle: rebuild
          const keys = objectMap.get(obj[key]);
          return keys;
        }
      }
    }
  } else {
    return obj;
  }
  return newObj;
};
