export class Utils {
  static isProductionMode = process.env.NODE_ENV === 'production'

  /**
   * Wait for passed number of ms
   * @param time in ms
   */
  static async waitForTimeout(time: number): Promise<void> {
    await new Promise((res) => setTimeout(res, time))
  }

  /**
   * Wait till passed timestamp in ms
   * @param timestamp in seconds
   */
  static async waitTillTimestamp(timestamp: number): Promise<void> {
    const now = new Date().getTime()
    const diff = timestamp - now
    if (diff > 0) return Utils.waitForTimeout(diff)
    return Promise.resolve()
  }
}
