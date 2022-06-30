/**
 * Converts empty value to null.
 *
 * @param obj
 * @returns {*}
 */
export const emptyToNull = (obj: any): any => {
  if (isScalarType(obj)) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(emptyToNull)
  }

  const result: any = {}

  for (const key of Object.keys(obj)) {
    const value = obj[key]

    if (typeof value === 'object') {
      result[key] = emptyToNull(value)
    } else {
      result[key] = nullIfEmpty(value)
    }
  }

  return result
}

/**
 * Returns if scalar type.
 *
 * @param obj
 * @returns {boolean}
 */
const isScalarType = (obj: any) => {
  return (
    typeof obj !== 'object' ||
    obj instanceof String ||
    obj instanceof Number ||
    obj instanceof Boolean ||
    obj === null
  )
}

/**
 * Returns null if string 'null'.
 *
 * @param obj
 * @returns {boolean}
 */
export const nullifyString = (str: string | null | undefined) => {
  if (str === 'null' || str === 'undefined' || str === '' || str === undefined) {
    return null
  }
  return str
}

/**
 * Changes empty value to null.
 *
 * @param value
 * @returns {*}
 */
const nullIfEmpty = (value: any) => {
  if (typeof value !== 'string') {
    return value
  }

  return value.trim() === '' ? null : value
}
