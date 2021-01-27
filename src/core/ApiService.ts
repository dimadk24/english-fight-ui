import { timeout } from 'promise-timeout'
import { toCamel, toSnake } from 'convert-keys'
import castArray from 'lodash.castarray'
import { ModelType } from './model-utils'

const API_URL = process.env.REACT_APP_API_URL

type Data = Record<string, unknown>

export class ApiService {
  static async post<T>(
    url: string,
    data: Data,
    { sendToken = true, expand = '', Model = null } = {}
  ): Promise<T> {
    return ApiService.send<T>(url, {
      data: ApiService.convertDataToBackendFormat(data),
      sendToken,
      method: 'POST',
      expand,
      Model,
    })
  }

  static async patch<T>(
    url: string,
    data: Data,
    { sendToken = true, expand = '', Model = null } = {}
  ): Promise<T> {
    return ApiService.send<T>(url, {
      data: ApiService.convertDataToBackendFormat(data),
      sendToken,
      method: 'PATCH',
      expand,
      Model,
    })
  }

  static async get<T>(
    url: string,
    { expand = '', Model = null } = {}
  ): Promise<T> {
    return ApiService.send<T>(url, {
      sendToken: true,
      method: 'GET',
      expand,
      Model,
    })
  }

  static async send<T>(
    url: string,
    {
      data,
      sendToken,
      method,
      expand,
      Model = null,
    }: {
      data?: Data
      sendToken: boolean
      method: string
      expand?: string
      Model?: ModelType<unknown>
    }
  ): Promise<T> {
    const urlParams = new URLSearchParams()
    if (expand) {
      const expandString = castArray(expand).join(',')
      urlParams.append('expand', expandString)
    }
    const options: RequestInit = {
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
    return ApiService.processResponse<T>(response, Model)
  }

  static createHeaders({
    sendToken,
  }: { sendToken?: boolean } = {}): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (sendToken) {
      headers.Authorization = ApiService.getAuthorizationHeader()
    }
    return headers
  }

  static getAuthorizationHeader(): string {
    const queryString = window.location.search.slice(1)
    return `QueryString ${queryString}`
  }

  static createFullUrl(
    relativeUrl: string,
    queryParams?: URLSearchParams
  ): string {
    const domain = ApiService.removeTrailingSlash(API_URL)
    let url = `${domain}/${relativeUrl}`
    if (queryParams && String(queryParams)) {
      url += `?${String(queryParams)}`
    }
    return url
  }

  static async processResponse<T>(
    response: Response,
    Model: ModelType<unknown> = null
  ): Promise<T> {
    if (response.status >= 500 && response.status < 600) {
      throw new Error('Внутренняя ошибка сервера')
    }
    let json: {
      detail?: string
    }
    try {
      json = await response.json()
    } catch (e) {
      throw new Error('Неверный ответ сервера')
    }
    if (!response.ok) {
      if (json.detail) {
        throw new Error(json.detail)
      }
      throw new Error('Неизвестная ошибка приложения')
    }
    return ApiService.convertDataToFrontendFormat<T>(json, Model)
  }

  static convertDataToBackendFormat(data: Data): Data {
    return toSnake(data)
  }

  static convertDataToFrontendFormat<T>(data: Data, Model = null): T {
    const camelCased: T = toCamel(data)
    if (Model) {
      return Model.fromObject(camelCased)
    }
    return camelCased
  }

  static removeTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url
  }
}
