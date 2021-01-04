export class Utils {
  static isProductionMode = process.env.NODE_ENV === 'production'

  static async waitForTimeout(time: number): Promise<void> {
    await new Promise((res) => setTimeout(res, time))
  }
}
