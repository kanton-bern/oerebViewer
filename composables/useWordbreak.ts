export const useWordbreak = () => {
  const isString = (value: unknown): value is string => {
    return typeof value === 'string' || value instanceof String
  }

  const wordbreak = (value: unknown): string | unknown => {
    return isString(value) ? value.replace(/_/g, '_\u00AD') : value
  }

  return {
    wordbreak,
  }
}
