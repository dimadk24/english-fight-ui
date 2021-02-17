export class URLUtils {
  static getSearchParam(name: string): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  static getHashParam(name: string): string {
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    return hashParams.get(name)
  }
}
