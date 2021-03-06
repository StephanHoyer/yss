'use strict'
import {
  camelize,
  cleanSplit,
  isObject,
  toAlphabetNumber,
  getClassName,
} from './utils'
import render from './render'
import { nest, media, animate, pseudo } from './helpers'

let classCounter = 0
function Yss(opts = {}) {
  const classNamesByStyle = {}
  opts = Object.assign(
    {
      getClassName,
      render,
    },
    opts
  )

  // this is the prototype of a styling instance.
  const baseInstance = {
    get class() {
      const serializedStyle = JSON.stringify(this.style)
      const existingClassname = classNamesByStyle[serializedStyle]
      if (existingClassname) {
        return existingClassname
      }
      const className = opts.getClassName(classCounter++, this.style)
      classNamesByStyle[serializedStyle] = className
      yss.style[className] = this.style
      return className
    },
    toString: function () {
      return this.class
    },
    toJSON: function () {
      return this.style
    },
    get className() {
      return this.class.slice(1)
    },
  }
  Object.setPrototypeOf(baseInstance, function () {})

  function parseStyle(styleInstance, key, ...args) {
    if (typeof key === 'string' && !args[0]) {
      // plain string, parse like template string
      key = [key]
    }
    if (Array.isArray(key)) {
      // template string
      // fold string array with args
      const string = key
        .map((part, i) => part + (args[i] == null ? '' : args[i]))
        .join('')
      // build style object
      return cleanSplit(string, /[;\n]/).reduce((style, row) => {
        let [key, ...value] = cleanSplit(row, /[ :]/)
        const prop = camelize(key)
        // if there is a helper with prop name, use it
        if (styleInstance[prop]) {
          styleInstance[prop](...value)
        } else {
          style[prop] = value.join(' ')
        }
        return style
      }, {})
    }
    if (key && key.style) {
      // merge instances
      return key.style
    }
    if (args[0]) {
      // key/value definition
      return { [key]: args[0] }
    }
    return key // object
  }

  // this creates a styling instance and hooks the upper prototype to it
  function yss(...args) {
    function styleInstance(...styleArgs) {
      Object.assign(
        styleInstance.style,
        parseStyle(styleInstance, ...styleArgs)
      )
      return styleInstance
    }
    styleInstance.style = {}
    styleInstance.yss = yss
    Object.setPrototypeOf(styleInstance, baseInstance)
    return styleInstance(...args)
  }

  yss.style = {}
  Object.defineProperty(yss, 'css', {
    get: () => opts.render(yss.style),
  })

  // this is the function to create helpers. Helpers are attached to the prototype of the styling
  // instances and to yss itself. When called on yss, they automatically create an instance and
  // and call the helpers on them right away
  yss.helper = function (name, ...args) {
    if (isObject(name)) {
      // define multiple helpers at once
      const helpers = name
      for (name in helpers) {
        yss.helper(name, helpers[name])
      }
      return
    }
    let fn = args[0]
    if (
      typeof args[0] === 'string' ||
      Array.isArray(args[0]) ||
      args[0].style
    ) {
      fn = y => y(...args)
    }
    if (fn.length === 1) {
      // set to baseInstance
      Object.defineProperty(baseInstance, name, {
        get: function () {
          fn(this)
          return this
        },
      })
      // set to yss itself
      Object.defineProperty(yss, name, {
        // create an instance and call helper right away
        get: () => yss({})[name],
      })
    } else {
      // set to baseInstance
      baseInstance[name] = function (...args) {
        fn(this, ...args)
        return this
      }
      // set to yss itself
      yss[name] = (...args) => yss({})[name](...args)
    }
  }

  // add default helpers
  yss.helper('nest', nest)
  yss.helper('media', media)
  yss.helper('animate', animate)
  pseudo(yss, 'hover')
  pseudo(yss, 'focus')

  return yss
}

export default Yss
