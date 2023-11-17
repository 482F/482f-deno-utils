import { assertEquals, assertThrows } from 'assert/mod.ts'
import { describe, it } from 'testing/bdd.ts'
import { assertType, Has } from 'testing/types.ts'

import { type Result, unwrap } from './result.ts'

describe('Result', () => {
  it('Success', () => {
    const s = [true, undefined] as const
    assertType<Has<typeof s, Result<true>>>(true)
  })

  it('Failure', () => {
    const f = [undefined, new Error('fail')] as const
    assertType<Has<typeof f, Result<false>>>(true)
  })
})

describe('unwrap', () => {
  it('Success', () => {
    const s = [true, undefined] as const
    assertEquals(unwrap(s), true)
  })
  it('Failure', () => {
    const f = [undefined, new Error('fail unwrap')] as const
    assertThrows(() => {
      unwrap(f)
    })
  })
})
