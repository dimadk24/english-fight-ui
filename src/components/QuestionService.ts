import { ApiService } from '../core/ApiService'

export class QuestionService {
  static createFullPictureUrl(relativeUrl: string): string {
    const relativeUrlWithoutSlash = QuestionService.removePrecedingSlash(
      relativeUrl
    )
    return ApiService.createFullUrl(relativeUrlWithoutSlash)
  }

  static removePrecedingSlash(url: string): string {
    return url.startsWith('/') ? url.slice(1) : url
  }
}
