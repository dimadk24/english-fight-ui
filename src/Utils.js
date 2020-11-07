export class Utils {
  static isProductionMode = process.env.NODE_ENV === 'production'

  static async waitForTimeout(time) {
    await new Promise((res) => setTimeout(res, time))
  }
}
