export function stringifyError(error: unknown) {
  return error instanceof Error ? error.message : `${error}`
}

export function stringifiedValueIsTheSame(value: unknown) {
  return isPrimitive(value) || isEmptyArray(value)
}

export function isPrimitive(value: unknown) {
  return (
    typeof value !== 'object'
      || value === null
      || typeof value === 'undefined'
      || typeof value === 'boolean'
      || typeof value === 'number'
      || typeof value === 'string'
      || typeof value === 'symbol'
      || typeof value === 'bigint'
  )
}

export function isEmptyArray(value: unknown) {
  return (
    Array.isArray(value) && value.length === 0
  )
}
