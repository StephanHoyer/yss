'use strict'

module.exports = {
  nest(y, selector, style) {
    y.style[` ${selector}`] = style
  },
  media(y, def, style) {
    y.style[`@media ${def}`] = style
  },

  animate(y, timing, frameStyles) {
    y.style.animation = { frameStyles, timing }
  },
}
