export class Utils {
  static isProductionMode = process.env.NODE_ENV === 'production'

  static async waitForTimeout(time: number): Promise<void> {
    await new Promise((res) => setTimeout(res, time))
  }

  static getSearchParam(name: string): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }
}
