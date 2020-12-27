import fromJSON from 'tcomb/lib/fromJSON'
import { struct } from 'tcomb'

function getFromObject(Model) {
  return (object) => {
    return fromJSON(object, Model)
  }
}

function set(key, value) {
  return this.constructor.update(this, {
    [key]: {
      $set: value,
    },
  })
}

/**
 * Creates tcomb model
 * @param {Object} props
 * @param {String} name
 * @param {Object} defaultProps
 * @returns {Class}
 */
export const createModel = (props, name, defaultProps = {}) => {
  const Model = struct(props, {
    strict: true,
    name,
    defaultProps,
  })

  Model.fromObject = getFromObject(Model)
  Model.prototype.set = set

  return Model
}

/**
 * Extends tcomb model
 * @param {Object} baseClass
 * @param {Object} props
 * @param {String} name
 * @returns {Class}
 */
export const extendModel = (baseClass, props, name) => {
  const Model = baseClass.extend(props, name)

  Model.fromObject = getFromObject(Model)
  Model.prototype.set = set

  return Model
}
