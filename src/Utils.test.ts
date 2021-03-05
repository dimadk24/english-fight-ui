import { Utils } from './Utils'

jest.useFakeTimers('modern')

describe('waitTillTimestamp', () => {
  it('resolves instantly when time is now', async () => {
    const before = new Date().getTime()
    const promise = Utils.waitTillTimestamp(before)
    jest.advanceTimersByTime(1)
    await promise
    const after = new Date().getTime()
    expect(after - before).toBe(1)
  })

  it('resolves instantly when time has passed', async () => {
    const before = new Date().getTime()
    const promise = Utils.waitTillTimestamp(before - 100)
    jest.advanceTimersByTime(1)
    await promise
    const after = new Date().getTime()
    expect(after - before).toBe(1)
  })

  it('waits till timestamp when time has not passed', async () => {
    const before = new Date().getTime()
    const promise = Utils.waitTillTimestamp(before + 1000)
    jest.advanceTimersByTime(1000)
    await promise
    const after = new Date().getTime()
    expect(after - before).toBe(1000)
  })

  it('wails will timestamp when time has partially passed', async () => {
    const before = new Date().getTime()
    jest.advanceTimersByTime(500)
    const promise = Utils.waitTillTimestamp(before + 1000)
    jest.advanceTimersByTime(500)
    await promise
    const after = new Date().getTime()
    expect(after - before).toBe(1000)
  })
})
