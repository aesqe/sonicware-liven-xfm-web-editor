export const compareObjects = (prev: object, current: object) => {
  const prevKeys = Object.keys(prev)
  const currentKeys = Object.keys(current)

  if (prevKeys.length !== currentKeys.length) {
    return false
  }

  return JSON.stringify(prev) === JSON.stringify(current)
}
