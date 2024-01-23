export type Compare<T> = (a: T, b: T) => -1 | 0 | 1

export function compareBy<T, U>(selector: (t: T) => U, compareU: Compare<U>): Compare<T> {
  return (a, b) => compareU(selector(a), selector(b))
}

export function reversed<T>(compare: Compare<T>): Compare<T> {
  return (a, b) => compare(b, a)
}

export function nilLast<T>(compare: Compare<T>): Compare<T | undefined | null> {
  return (a, b) => {
    if (!isNil(a) && !isNil(b)) return compare(a, b)
    if (!isNil(a)) return -1
    if (!isNil(b)) return 1
    return 0
  }
}
function isNil(value: unknown): value is null | undefined {
  return value == undefined
}

export class Chain<T> {
  readonly compare: Compare<T>

  private constructor(compare: Compare<T>) {
    this.compare = compare
  }

  static of<T>(compare: Compare<T>): Chain<T> {
    return new Chain(compare)
  }

  static by<T, U>(selector: (t: T) => U, compareU: Compare<U>): Chain<T> {
    return this.of(compareBy(selector, compareU))
  }

  then(next: Compare<T>): Chain<T> {
    const curr = this.compare
    return new Chain((a, b) => {
      // apply next only if result remains undecided, i.e. 0
      const result = curr(a, b)
      return result !== 0 ? result : next(a, b)
    })
  }

  thenBy<U>(selector: (t: T) => U, compareU: Compare<U>): Chain<T> {
    return this.then(compareBy(selector, compareU))
  }
}

export const compareNumber: Compare<number> = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
