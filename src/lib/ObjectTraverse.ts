export class ObjectTraverse {
  static traverse(
    obj: { [key: string]: any },
    dispatch: (parentObj: { [key: string]: any }, key: string | number) => void,
    objectMap: Set<string> = new Set(),
    traversedObjectString: string = ""
  ) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Only conintue if not cyclical
        traversedObjectString += `.${key}`;
        if (!objectMap.has(traversedObjectString)) {
          objectMap.add(traversedObjectString);
          ObjectTraverse.traverse(obj[key], dispatch, objectMap);
          dispatch(obj, key);
        }
      }
    }
  }
}
