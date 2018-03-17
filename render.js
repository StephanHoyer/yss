'use strict'

const { kebabCase } = require('./utils')
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

function toCssDefinition(cssClass, style) {
  const baseStyle = keys(style)
    .filter(isAttr)
    .map(attr => `${kebabCase(attr)}:${style[attr]}`)
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

module.exports = function(style) {
  return keys(style)
    .map(function(cssClass) {
      return `${toCssDefinition(cssClass, style[cssClass])}`
    })
    .join('')
}
