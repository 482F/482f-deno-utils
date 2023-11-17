import type { Result } from './result.ts'
import { delay } from 'https://deno.land/std@0.207.0/async/delay.ts'

export async function wait<
  F extends () => unknown,
  R extends NonNullable<Awaited<ReturnType<F>>>,
>(func: F, intervalMs: number, timeoutMs = 10_000): Promise<Result<R>> {
  let timeouted = false
  let timeoutId: number | undefined = undefined
  if (timeoutMs) {
    timeoutId = setTimeout(() => {
      timeouted = true
    }, timeoutMs)
  }

  let result: R | null = null
  while (!result && !timeouted) {
    result = (await func()) as R
    await delay(intervalMs)
  }

  clearTimeout(timeoutId)
  if (!result) {
    return [undefined, new Error('wait 関数がタイムアウトしました')]
  }

  return [result, undefined]
}
