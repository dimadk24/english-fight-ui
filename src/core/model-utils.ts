import fromJSON from 'tcomb/lib/fromJSON'
import { Struct, struct, StructProps } from 'tcomb'

function getFromObject<T>(Model: ModelType<T>) {
  return function fromObject(object: Record<string, unknown>) {
    return fromJSON<T>(object, Model)
  }
}

function set(key: string, value: unknown) {
  return this.constructor.update(this, {
    [key]: {
      $set: value,
    },
  })
}

export interface ModelType<T> extends Struct<T> {
  fromObject(object: Record<string, unknown>): T
}

export interface ModelInstance {
  set(key: string, value: unknown): this
}

export function createModel<T>(
  attributes: StructProps,
  name: string,
  defaultProps = {}
): ModelType<T> {
  // @ts-ignore
  const Model: ModelType<T> = struct(attributes, {
    name,
    defaultProps,
  })

  Model.fromObject = getFromObject<T>(Model)
  Model.prototype.set = set

  return Model
}

export function extendModel<T>(
  baseClass: ModelType<Record<string, unknown>>,
  props: StructProps,
  name: string
): ModelType<T> {
  // @ts-ignore
  const Model: ModelType<T> = baseClass.extend(props, name)

  Model.fromObject = getFromObject<T>(Model)
  Model.prototype.set = set

  return Model
}
