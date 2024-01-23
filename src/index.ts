export type Compare<T> = (a: T, b: T) => -1 | 0 | 1

export function compareBy<T, U>(selector: (t: T) => U, compareU: Compare<U>): Compare<T> {
  return (a, b) => compareU(selector(a), selector(b))
}

export function reversed<T>(compare: Compare<T>): Compare<T> {
  return (a, b) => compare(b, a)
}

export const compareNumber: Compare<number> = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
