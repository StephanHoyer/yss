'use strict'

const { kebabCase } = require('./utils')
const keys = Object.keys

function isNoPseudo(attr) {
  return attr[0] !== ':'
}
function isPseudo(attr) {
  return attr[0] === ':'
}

function toCssDefinition(cssClass, style) {
  const baseStyle = keys(style)
    .filter(isNoPseudo)
    .map(attr => `${kebabCase(attr)}:${style[attr]}`)
    .join(';')
  const pseudoStyles = keys(style)
    .filter(isPseudo)
    .map(pseudo => toCssDefinition(cssClass + pseudo, style[pseudo].style))
    .join('')
  return `${cssClass}{${baseStyle}}${pseudoStyles}`
}

module.exports = function(style) {
  return keys(style).map(function (cssClass) {
    return `${toCssDefinition(cssClass, style[cssClass])}`
  }).join('')
}
