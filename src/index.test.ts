import { describe, expect, test } from 'vitest'
import { shuffle } from '@vitest/utils'

import * as C from '.'

describe('sort numbers', () => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  test('asc', () => {
    expect(shuffle([...nums]).sort(C.compareNumber)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
  
  test('desc', () => {
    expect(shuffle([...nums]).sort(C.reversed(C.compareNumber))).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  })
})

describe('sort points', () => {
  type Point = {
    x: number
    y: number
  }
  const points: Point[] = [
    {x: 0, y: 0},
    {x: 0, y: 1},
    {x: 0, y: 2},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 1, y: 2},
  ]
  const cmpX = C.compareBy<Point, number>(p => p.x, C.compareNumber)
  const cmpY = C.compareBy<Point, number>(p => p.y, C.compareNumber)
  
  test('by single prop', () => {
    const byY = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 1, y: 1},
      {x: 0, y: 2},
      {x: 1, y: 2},
    ]
  
    expect([...points].sort(cmpY)).toEqual(byY)
    expect([...byY].sort(cmpX)).toEqual(points)
  })
  
  test('by y then by x desc', () => {
    const { compare } = C.Chain.of(cmpY).thenBy(p => p.x, C.reversed(C.compareNumber))
    expect(shuffle([...points]).sort(compare)).toEqual([
      {x: 1, y: 0},
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 2},
      {x: 0, y: 2},
    ])
  })
})

test('nils last', () => {
  expect([0, 2, undefined, 1, undefined, 3].sort(C.nilLast(C.compareNumber))).toEqual([0, 1, 2, 3, undefined, undefined])
  expect([0, 2, null, 1, null, 3].sort(C.nilLast(C.compareNumber))).toEqual([0, 1, 2, 3, null, null])
})

describe('syntax example', () => {
  type User = {
    name: string
    age?: number
  }

  const users: User[] = [
    { name: 'John' },
    { name: 'John', age: 25 },
    { name: 'Bob'}
  ]

  const compareString: C.Compare<string> = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

  test('using by chain', () => {
    const compareUser = C.Chain
      .by<User, string>(x => x.name, compareString)
      .thenBy(x => x.age, C.nilLast(C.compareNumber))
      .compare

    expect([...users].sort(compareUser)).toEqual([
      { name: 'Bob'},
      { name: 'John', age: 25 },
      { name: 'John' },
    ])
  })

  test('using compare chain', () => {
    const compareName: C.Compare<User> = C.compareBy(x => x.name, compareString)
    const compareAge: C.Compare<User> = C.compareBy(x => x.age, C.nilLast(C.compareNumber))
    const compareUser = C.Chain.of(compareName).then(compareAge).compare

    expect([...users].sort(compareUser)).toEqual([
      { name: 'Bob'},
      { name: 'John', age: 25 },
      { name: 'John' },
    ])
  })
})