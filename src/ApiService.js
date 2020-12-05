import { timeout } from 'promise-timeout'
import { toCamel, toSnake } from 'convert-keys'
import castArray from 'lodash.castarray'

const API_URL = process.env.REACT_APP_API_URL

export class ApiService {
  /**
   * @public
   * @param url
   * @param data
   * @param sendToken
   * @param expand
   * @returns {Promise<*>}
   */
  static async post(url, data, { sendToken = true, expand } = {}) {
    return ApiService.send(url, {
      data: ApiService.convertDataToBackendFormat(data),
      sendToken,
      method: 'POST',
      expand,
    })
  }

  /**
   * @public
   * @param url
   * @param data
   * @param sendToken
   * @param expand
   * @returns {Promise<*>}
   */
  static async patch(url, data, { sendToken = true, expand } = {}) {
    return ApiService.send(url, {
      data: ApiService.convertDataToBackendFormat(data),
      sendToken,
      method: 'PATCH',
      expand,
    })
  }

  /**
   * @public
   * @param url
   * @param expand
   * @returns {Promise<*>}
   */
  static async get(url, { expand } = {}) {
    return ApiService.send(url, { sendToken: true, method: 'GET', expand })
  }

  /**
   * @private
   * @param url
   * @param data
   * @param sendToken
   * @param method
   * @param expand
   * @returns {Promise<*>}
   */
  static async send(url, { data, sendToken, method, expand }) {
    const urlParams = new URLSearchParams()
    if (expand) {
      const expandString = castArray(expand).join(',')
      urlParams.append('expand', expandString)
    }
    const options = {
      headers: ApiService.createHeaders({ sendToken }),
    }
    if (method !== 'GET') {
      options.mode = 'cors'
      options.body = JSON.stringify(data)
    }
    options.method = method
    const response = await timeout(
      fetch(ApiService.createFullUrl(url, urlParams), options),
      10000
    )
    return ApiService.processResponse(response)
  }

  /**
   * @private
   * @param sendToken
   * @returns {{Accept: string, "Content-Type": string}}
   */
  static createHeaders({ sendToken } = {}) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (sendToken) {
      headers.Authorization = ApiService.getAuthorizationHeader()
    }
    return headers
  }

  static getAuthorizationHeader() {
    const queryString = window.location.search.slice(1)
    return `QueryString ${queryString}`
  }

  /**
   * @public
   * @param relativeUrl
   * @param queryParams
   * @returns {string}
   */
  static createFullUrl(relativeUrl, queryParams) {
    const domain = ApiService.removeTrailingSlash(API_URL)
    let url = `${domain}/${relativeUrl}`
    if (queryParams && String(queryParams)) {
      url += `?${String(queryParams)}`
    }
    return url
  }

  /**
   * @private
   * @param response
   * @returns {Promise<*>}
   */
  static async processResponse(response) {
    if (response.status >= 500 && response.status < 600) {
      throw new Error('Internal server error')
    }
    let json
    try {
      json = await response.json()
    } catch (e) {
      throw new Error('Invalid response from the server')
    }
    if (!response.ok) {
      if (json.detail) {
        throw new Error(json.detail)
      }
      throw new Error('Unknown application error')
    }
    return ApiService.convertDataToFrontendFormat(json)
  }

  /**
   * @private
   * @param {Object} data
   * @returns {Object}
   */
  static convertDataToBackendFormat(data) {
    return toSnake(data)
  }

  /**
   * @private
   * @param {Object} data
   * @returns {Object}
   */
  static convertDataToFrontendFormat(data) {
    return toCamel(data)
  }

  /**
   * @private
   * @param url
   * @returns {any}
   */
  static removeTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url
  }
}
