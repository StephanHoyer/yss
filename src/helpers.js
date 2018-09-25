'use strict'

export function nest(y, selector, style) {
  y.style[` ${selector}`] = y.yss(style)
}

export function media(y, def, style) {
  y.style[`@media ${def}`] = y.yss(style)
}

export function animate(y, timing, frameStyles) {
  y.style.animation = { frameStyles, timing }
}

export function pseudo(yss, name, helperName = name) {
  const selector = `:${name}`
  yss.helper(helperName, (y, key, ...args) => {
    if (!y.style[selector] || !y.style[selector].style) {
      y.style[selector] = yss(y.style[selector])
    }
    y.style[selector](key, ...args)
  })
}
