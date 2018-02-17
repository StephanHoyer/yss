const o = require('ospec')
const yss = require('..')
const pseudo = require('../helpers/pseudo')

o.spec('pseudo helper', () => {
  pseudo(yss, 'hover')
  o('add hover style as obj', () => {
    const y = yss.foobar({ color: 'black' })
    o(y.style[':hover'].style).deepEquals({ color: 'black' })
  })
})
