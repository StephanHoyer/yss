const o = require('ospec')
const Yss = require('../yss')

o.spec('pseudo helper', () => {
  let yss

  o.beforeEach(() => {
    yss = Yss()
  })

  o('add hover style as obj', () => {
    const y = yss.hover({ color: 'black' })
    o(y.style[':hover'].style).deepEquals({ color: 'black' })
  })

  o('add hover style as key/value', () => {
    const y = yss.hover('color', 'black')
    o(y.style[':hover'].style).deepEquals({ color: 'black' })
  })

  o('add hover style as template string', () => {
    const y = yss.hover`
      color: black
      background: blue
    `
    o(y.style[':hover'].style).deepEquals({
      color: 'black',
      background: 'blue',
    })
  })

  o('overwrite hover styles', () => {
    const y = yss.hover`color: black`.hover`color: red`
    o(y.style[':hover'].style).deepEquals({ color: 'red' })
  })

  o('use in helper', () => {
    yss.helper('hovercolor', (y, color) => {
      y.hover('color', color)
    })
    const y = yss.hover`color: brick`.hovercolor('yellow')
    o(y.style[':hover'].style).deepEquals({ color: 'yellow' })
  })

  o('use in helper, reference normal style', () => {
    yss.helper('hoverdarken', y => {
      y.hover('color', `dark${y.style.color}`)
    })
    const y = yss`color: green`.hoverdarken
    o(y.style[':hover'].style).deepEquals({ color: 'darkgreen' })
  })
})

o.spec('other helper', () => {
  let yss

  o.beforeEach(() => {
    yss = Yss()
  })

  o('nest helper', () => {
    o(yss.nest('span', yss`background purple`).style[' span'].style).deepEquals(
      { background: 'purple' }
    )
  })

  o('media query helper', () => {
    o(
      yss.media('only screen and (max-width: 600px)', yss`background brick`)
        .style['@media only screen and (max-width: 600px)'].style
    ).deepEquals({ background: 'brick' })
  })
})
