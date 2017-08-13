let classCounter = 0

const camelize = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase())
const cleanSplit = (s, regExp) => s.split(regExp).map(a => a.trim()).filter(a => a)

// this is the prototype of a styling instance.
const baseInstance = {
  get class() {
    const classname = 'someClass' + classCounter++
    yss.style[classname] = this.style
    return '.' + classname
  }
}

function parseStyle(key, ...args) {
  if (typeof key === 'string' && !args[0]) { // plain string, parse like template string
    key = [key]
  }
  if (Array.isArray(key)) { // template string
    // fold string array with args
    const string = key.map((part, i) => part + (args[i] == null ? '' : args[i])).join('')
    // build style object
    return cleanSplit(string, /[;\n]/).reduce((style, row) => {
      [key, ...value] = cleanSplit(row, /[ :]/)
      style[camelize(key)] = value.join(' ')
      return style
    }, {})
  }
  if (key && key.style) { // merge instances
    return key.style
  }
  if (args[0]) { // key/value definition
    return { [key]: args[0] }
  }
  return key // object
}

// this creates a styling instance and hooks the upper prototype to it
function yss(...args) {
  function styleInstance(...styleArgs) {
    Object.assign(styleInstance.style, parseStyle(...styleArgs))
    return styleInstance
  }
  styleInstance.style = {}
  Object.setPrototypeOf(styleInstance, baseInstance)
  return styleInstance(...args)
}

// this is the global style that might be attached to the header of renders a css serverside
yss.style = {}

// this is the function to create helpers. Helpers are attached to the prototype of the styling
// instances and to yss itself. When called on yss, they automatically create an instance and
// and call the helpers on them right away
yss.helper = function(name, def) {
  if (def.length === 1) {
    // set to baseInstance
    Object.defineProperty(baseInstance, name, {
      get: function() {
        def(this)
        return this
      }
    })
    // set to yss itself
    Object.defineProperty(yss, name, {
      // create an instance and call helper right away
      get: () => yss({})[name]
    })
  } else {
    // set to baseInstance
    baseInstance[name] = function(...args) {
      def(this, ...args)
      return this
    }
    // set to yss itself
    yss[name] = (...args) => yss({})[name](...args)
  }
}

module.exports = yss
