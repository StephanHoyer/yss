'use strict'

module.exports = function pseudo(yss, name, helperName=name) {
  const selector = `:${name}`
  yss.helper(helperName, (y, key, ...args) => {
    if (!y.style[selector] || !y.style[selector].style) {
      y.style[selector] = yss(y.style[selector])
    }
    y.style[selector](key, ...args)
  })
}
