import { assertEquals, assertInstanceOf } from 'assert/mod.ts'
import { describe, it } from 'testing/bdd.ts'

import { delay } from 'https://deno.land/std@0.207.0/async/delay.ts'
import { wait } from './promise.ts'
import type { Result } from './result.ts'

describe('wait', () => {
  const intervalMs = 30
  const timeoutMs = 200
  function waitTest(
    intervalCallback: () => unknown = async (): Promise<void> => await delay(0),
  ): [{ value: boolean }, Promise<Result<0 | 1>>, () => void] {
    const isResolved = { value: false }
    let num: 0 | 1 = 0
    return [
      isResolved,
      wait(
        async () => {
          await intervalCallback()
          return num
        },
        intervalMs,
        timeoutMs,
      ).then((r: Result<0 | 1>) => {
        isResolved.value = true
        return r
      }),
      (): void => {
        num = 1
      },
    ]
  }
  it('normal', async () => {
    const [isResolved, waitPromise, doResolve] = waitTest()

    await delay(intervalMs * 2)
    assertEquals(isResolved.value, false)
    doResolve()
    const result = await waitPromise
    assertEquals(isResolved.value, true)
    assertEquals(result[0], 1)
    assertEquals(result[1], undefined)
  })
  it('interval', async () => {
    let intervaledNumber = 0
    const [, waitPromise, doResolve] = waitTest(() => intervaledNumber++)

    const intervalNumber = 2

    await delay(intervalMs * (intervalNumber + 0.1))
    assertEquals(intervaledNumber, intervalNumber + 1)
    doResolve()
    await waitPromise
    await delay(intervalMs * (intervalNumber + 0.1))
    assertEquals(intervaledNumber, intervalNumber + 2)
  })
  it('timeout', async () => {
    const [, waitPromise] = waitTest()
    const result = await waitPromise
    assertEquals(result[0], undefined)
    assertInstanceOf(result[1], Error)
  })
})
