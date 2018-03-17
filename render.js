'use strict'

const { kebabCase, map, toAlphabetNumber } = require('./utils')
const keys = Object.keys

function isAttr(attr) {
  return attr[0] !== ':' && attr[0] !== ' ' && attr[0] !== '@'
}

function isSubselector(attr) {
  return attr[0] === ':' || attr[0] === ' '
}

function isMediaQuery(attr) {
  return attr[0] === '@'
}

const animationNameByStyle = {}
let animationCounter = 0
module.exports = function(style) {
  const usedAnimations = {}
  function toCssDefinition(cssClass, style) {
    const baseStyle = keys(style)
      .filter(isAttr)
      .map(attr => {
        let value = style[attr]
        if (attr === 'animation') {
          const frameStyles = style[attr].frameStyles
          const animationStyle = map(frameStyles, (y, frameName) => toCssDefinition(frameName, y.style))
            .join('')
          if (!animationNameByStyle[animationStyle]) {
            animationNameByStyle[animationStyle] = 'a' + toAlphabetNumber(animationCounter++)
          }
          usedAnimations[animationStyle] = animationNameByStyle[animationStyle]
          value =`${style[attr].timing || ''} ${animationNameByStyle[animationStyle]}`
        }
        return `${kebabCase(attr)}:${value}`
      })
      .join(';')
    const subStyles = keys(style)
      .filter(isSubselector)
      .map(pseudo => toCssDefinition(cssClass + pseudo, style[pseudo].style))
      .join('')
    const mediaStyles = keys(style)
      .filter(isMediaQuery)
      .map(mediaQuery => `${mediaQuery}{${toCssDefinition(`${cssClass}`, style[mediaQuery].style)}}`)
      .join('')
    return `${cssClass}{${baseStyle}}${subStyles}${mediaStyles}`
  }

  const styles = keys(style)
    .map(function(cssClass) {
      return `${toCssDefinition(cssClass, style[cssClass])}`
    })
    .join('')
  const keyframes = map(usedAnimations, (name, keyframeStyle) => `@keyframes ${name}{${keyframeStyle}}`).join('')
  return keyframes + styles
}
