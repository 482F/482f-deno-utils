import { assertEquals } from 'assert/mod.ts'
import { describe, it } from 'testing/bdd.ts'
import { assertType, IsExact } from 'testing/types.ts'
import { isNotNullish } from './common.ts'

describe('isNotNullish', () => {
  it('normal', () => {
    const o = [42, '', []] as unknown[]
    const inn = o.every((v) => isNotNullish(v))
    assertEquals(inn, true)
  })
  it('null', () => {
    const o = [null, undefined] as unknown[]
    const inn = o.some((v) => isNotNullish(v))
    assertEquals(inn, false)
  })
  it('type', () => {
    const o = 42 as unknown
    const inn = isNotNullish(o)
    if (inn) {
      assertType<IsExact<typeof o, Record<string, unknown>>>(true)
    } else {
      assertType<IsExact<typeof o, unknown>>(true)
    }
  })
})
