import { ApiService } from './ApiService'

describe('ApiService', () => {
  describe('removeTrailingSlash', () => {
    it('removes trailing slash if string ends with it', () => {
      expect(ApiService.removeTrailingSlash('http://localhost:3000/')).toBe(
        'http://localhost:3000'
      )
    })

    it('does nothing if string does not end with slash', () => {
      expect(ApiService.removeTrailingSlash('http://localhost:3000')).toBe(
        'http://localhost:3000'
      )
    })
  })

  describe('createFullUrl', () => {
    beforeEach(() => {
      ApiService.removeTrailingSlash = jest.fn(() => 'https://vk.com')
    })

    it('creates url without search params if only url was passed', () => {
      expect(ApiService.createFullUrl('test')).toBe('https://vk.com/test')
    })

    it('creates url without search params if empty search params were passed', () => {
      expect(ApiService.createFullUrl('akani', new URLSearchParams())).toBe(
        'https://vk.com/akani'
      )
    })

    it('creates url with search params if they were passed', () => {
      const searchParams = new URLSearchParams('expand=test')
      expect(ApiService.createFullUrl('create', searchParams)).toBe(
        'https://vk.com/create?expand=test'
      )
    })
  })
})
