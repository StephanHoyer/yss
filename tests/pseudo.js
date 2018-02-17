const o = require('ospec')
const Yss = require('..')
const pseudo = require('../helpers/pseudo')

o.spec('pseudo helper', () => {
  let yss

  o.beforeEach(() => {
    yss = Yss()
    pseudo(yss, 'hover')
  })

  o('add hover style as obj', () => {
    const y = yss.hover({ color: 'black' })
    o(y.style[':hover'].style).deepEquals({ color: 'black' })
  })
})
