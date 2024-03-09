export function createAreReferencesChanged() {
  let previousObjects = new WeakSet<any>()
  let previousObjectsCount = 0

  function areReferencesChanged(objects: readonly any[]) {
    let referencesChanged = false

    // Check if the number of objects is different from the previous call
    if (objects.length !== previousObjectsCount)
      referencesChanged = true

    if (!referencesChanged) {
      for (const obj of objects) {
        if (!previousObjects.has(obj)) {
          referencesChanged = true
          break
        }
      }
    }

    previousObjectsCount = objects.length

    if (referencesChanged) {
      // Update the count of objects
      previousObjects = new WeakSet<any>()
      for (const obj of objects)
        previousObjects.add(obj)
    }

    return referencesChanged
  }

  return areReferencesChanged
}
