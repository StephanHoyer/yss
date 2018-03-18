'use strict'

var KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g

export function kebabCase(str) {
  return str.replace(KEBAB_REGEX, match => `-${match.toLowerCase()}`)
}

export function camelize(s) {
  return s.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

export function cleanSplit(s, regExp) {
  return s
    .split(regExp)
    .map(a => a.trim())
    .filter(a => a)
}

export function isObject(thing) {
  return typeof thing === 'object'
}

const alphabet =
  '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_-'
export function toAlphabetNumber(number) {
  const rest = number % alphabet.length
  const char = alphabet[rest]
  if (number < alphabet.length) {
    return char
  }
  const quotient = Math.floor(number / alphabet.length)
  return toAlphabetNumber(quotient) + char
}

export function getClassName(n) {
  return '.y' + toAlphabetNumber(n)
}

export const keys = Object.keys
export function map(obj, fn) {
  return Object.keys(obj).map(key => fn(obj[key], key))
}
