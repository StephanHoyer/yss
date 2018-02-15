'use strict';

var KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

function kebabCase(str) {
  return str.replace(KEBAB_REGEX, match => `-${match.toLowerCase()}`)
}

function camelize(s) {
  return s.replace(/-([a-z])/g, g => g[1].toUpperCase())
}

function cleanSplit(s, regExp) {
  return s.split(regExp).map(a => a.trim()).filter(a => a)
}

module.exports = {
  kebabCase, camelize, cleanSplit
}
