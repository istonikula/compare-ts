# compare-ts

```TypeScript
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
```
