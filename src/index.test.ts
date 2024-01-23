import { expect, test } from 'vitest'

import * as C from '.'

test('sort number', () => {
  expect([0, 2, 1, 4, 3, 6, 5, 8, 7].sort(C.compareNumber)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
})