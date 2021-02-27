import { timeout } from 'promise-timeout'
import { toCamel, toSnake } from 'convert-keys'
import castArray from 'lodash.castarray'
import { getModelByName, ModelInstance, ModelType } from './model-utils'
import { Utils } from '../Utils'
import { URLUtils } from '../URLUtils'
import camelCase from 'lodash.camelcase'
import pickBy from 'lodash.pickby'

const API_HOST = process.env.REACT_APP_API_HOST
const isApiUsingSSL = API_HOST.includes('https://')
const websocketProtocol = isApiUsingSSL ? 'wss://' : 'ws://'
const INTERNAL_SERVER_ERROR = 'Внутренняя ошибка сервера'

const websocketCloseCodeToError = {
  3000: 'Не авторизован',
}

type Data = Record<string, unknown>

type WSInputData = {
  type: string
  model?: string
  data?: Data
  instance?: Data
}

type SocketProps =
  | {
      onMessage?(data: unknown): void
      onOpen?(ev: Event): void
      onClose?(event: CloseEvent): void
      onError?(): void
    }
  | Record<string, (data: unknown) => void>

export interface JsonWebSocket extends WebSocket {
  sendJson(data: Data): void
  sendEvent(name: string, data?: Data): void
}

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
      fetch(ApiService.createFullApiURL(url, urlParams), options),
      10000
    )
    return ApiService.processResponse<T>(response, Model)
  }

  static openSocketConnection(
    url: string,
    {
      onMessage = () => {},
      onOpen = () => {},
      onClose = () => {},
      onError = () => {},
      ...customEventListeners
    }: SocketProps
  ): JsonWebSocket {
    const fullUrl = ApiService.createFullSocketURL(url)

    const parseAndCallOnMessage = (event: MessageEvent) => {
      const inputData: WSInputData = JSON.parse(event.data)
      let parsedInstance: ModelInstance | null = null
      if (inputData.instance) {
        const Model: ModelType<Record<string, unknown>> | null = getModelByName(
          inputData.model
        )
        parsedInstance = ApiService.convertDataToFrontendFormat<ModelInstance>(
          inputData.instance,
          Model
        )
      }

      const eventName: string = camelCase(inputData.type)
      const hasCustomListener = Object.prototype.hasOwnProperty.call(
        customEventListeners,
        eventName
      )
      const props = {
        type: inputData.type,
        data: inputData.data || null,
        instance: parsedInstance,
      }
      if (hasCustomListener) {
        customEventListeners[eventName](props)
      }

      onMessage(props)
    }

    const throwOnClose = (e: CloseEvent) => {
      const userFriendlyMessage =
        websocketCloseCodeToError[e.code] || INTERNAL_SERVER_ERROR
      if (!websocketCloseCodeToError[e.code])
        // eslint-disable-next-line no-console
        console.error(`Ошибка вебсокета #${e.code}`)
      throw new Error(userFriendlyMessage)
    }

    const throwOnError = () => {
      throw new Error('Неизвестная ошибка соединения')
    }

    const socket: WebSocket = new WebSocket(fullUrl)
    socket.addEventListener('message', parseAndCallOnMessage)
    socket.addEventListener('close', throwOnClose)
    socket.addEventListener('close', onClose)
    socket.addEventListener('error', throwOnError)
    socket.addEventListener('error', onError)

    // @ts-ignore
    socket.sendJson = function sendJson(this: JsonWebSocket, data: Data) {
      this.send(JSON.stringify(data))
    }
    // @ts-ignore
    socket.sendEvent = function sendEvent(
      this: JsonWebSocket,
      name: string,
      data?: Data
    ) {
      this.sendJson(
        pickBy(
          {
            type: name,
            data,
          },
          (value) => value
        )
      )
    }

    const jsonSocket = <JsonWebSocket>socket

    const authenticate = () => {
      jsonSocket.sendEvent('authenticate', {
        authorization: ApiService.getAuthorizationHeader(),
      })
    }
    socket.addEventListener('open', authenticate)
    socket.addEventListener('open', onOpen)

    return jsonSocket
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
    if (URLUtils.getSearchParam('fake_vk_id')) {
      if (Utils.isProductionMode)
        throw new Error('You cannot use fake_vk_id in production')
      return ApiService.getFakeVKIDAuthHeader()
    }
    return ApiService.getQueryStringAuthHeader()
  }

  static getQueryStringAuthHeader(): string {
    const queryString = window.location.search.slice(1)
    return `QueryString ${queryString}`
  }

  static getFakeVKIDAuthHeader(): string {
    const fakeVkID = URLUtils.getSearchParam('fake_vk_id')
    return `FakeVKID ${fakeVkID}`
  }

  static createFullApiURL(
    relativeUrl: string,
    queryParams?: URLSearchParams
  ): string {
    return ApiService.createFullUrl(`api/${relativeUrl}`, queryParams)
  }

  static createFullSocketURL(relativeUrl: string): string {
    const fullRelativeUrl = `ws/${relativeUrl}`
    let domain = ApiService.removeTrailingSlash(API_HOST)
    domain = domain.slice(domain.indexOf('://') + 3)
    return `${websocketProtocol}${domain}/${fullRelativeUrl}`
  }

  static createFullUrl(
    relativeUrl: string,
    queryParams?: URLSearchParams
  ): string {
    const domain = ApiService.removeTrailingSlash(API_HOST)
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
      throw new Error(INTERNAL_SERVER_ERROR)
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
