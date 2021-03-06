const o = require('ospec')
const Yss = require('../yss')

o.spec('yss', () => {
  let yss

  o.beforeEach(() => {
    yss = Yss()
  })

  o.spec('create style instance', () => {
    o('two args', () => {
      o(yss('color', 'purple').style).deepEquals({ color: 'purple' })
    })

    o('template strings', () => {
      var y = yss`
        transform: scale(123)
        color green
        border: 1px solid green;fill brown
        border-radius: 1rem 2rem 3rem 4rem
      `.style
      o(y).deepEquals({
        transform: 'scale(123)',
        color: 'green',
        border: '1px solid green',
        fill: 'brown',
        borderRadius: '1rem 2rem 3rem 4rem',
      })
    })

    o('template strings with vars', () => {
      o(yss`top ${123}px`.style).deepEquals({ top: '123px' })
    })

    o('object', () => {
      o(yss({ fill: 'red' }).style).deepEquals({ fill: 'red' })
    })

    o('plain strings', () => {
      o(yss('fill: red;color orange').style).deepEquals({
        fill: 'red',
        color: 'orange',
      })
    })
  })

  o.spec('chaining', () => {
    o('combine multiple calls', () => {
      o(
        yss({ fill: 'red' })({ border: 'green' })`color yellow`.style
      ).deepEquals({
        fill: 'red',
        border: 'green',
        color: 'yellow',
      })
    })

    o('overwrite', () => {
      o(yss({ fill: 'blue' })`fill red`.style).deepEquals({ fill: 'red' })
    })

    o('merge instances', () => {
      o(yss({ fill: 'blue' })(yss`fill red`).style).deepEquals({ fill: 'red' })
    })
  })

  o('css classes and global style', () => {
    const y1 = yss({ fill: 'rose' })
    const y2 = yss({ fill: 'gold' })
    o(y1.class).equals('.y0')
    o(y1.className).equals('y0')
    o('' + y2).equals('.y1')
    o(yss.style).deepEquals({
      '.y0': { fill: 'rose' },
      '.y1': { fill: 'gold' },
    })
  })

  o('render global style css', () => {
    const y = yss({ backgroundColor: 'green' })
    y.style[':pseudo(1)'] = yss({ fill: 'darkgreen' })
    y.style[':pseudo(1)'].style[':pseudo(2)'] = yss({ fill: 'darkergreen' })
    o(y.class).equals('.y2')
    o(yss.css).deepEquals(
      `.y2{background-color:green}.y2:pseudo(1){fill:darkgreen}.y2:pseudo(1):pseudo(2){fill:darkergreen}`
    )
  })

  o('same style, same classname', () => {
    const a = yss`color: red`
    const b = yss`color: red`
    o(a.class).equals(b.class)
    aClass = a.class
    a`backgroundColor: green`
    b`backgroundColor: green`
    o(a.class).notEquals(aClass)
    o(a.class).equals(b.class)
  })

  o.spec('helper', () => {
    o('plain string', () => {
      yss.helper('fillGreen', 'fill: green')
      o(yss.fillGreen.style).deepEquals({ fill: 'green' })
    })

    o('template string', () => {
      yss.helper('fillBlue', `fill: ${'blue'}`)
      o(yss.fillBlue.style).deepEquals({ fill: 'blue' })
    })

    o('plain yss', () => {
      yss.helper('fillTomato', yss`fill: tomato`)
      o(yss.fillTomato.style).deepEquals({ fill: 'tomato' })
    })

    o('without args', () => {
      yss.helper('fillOlive', y => y`fill: olive`)
      o(yss.fillOlive.style).deepEquals({ fill: 'olive' })
    })

    o('with args', () => {
      yss.helper('grad', (y, color1, color2) =>
        y({ background: `linear-gradient(to bottom, ${color1}, ${color2})` })
      )
      o(yss.grad('karmin', 'red').style).deepEquals({
        background: 'linear-gradient(to bottom, karmin, red)',
      })
    })

    o('helper uses other helper', () => {
      yss.helper('fillOlive', y => y`fill: olive`)
      yss.helper('awesome', y => y('color', 'white').fillOlive)
      o(yss.awesome({ border: 'none' }).style).deepEquals({
        fill: 'olive',
        color: 'white',
        border: 'none',
      })
    })

    o('helper used as string', () => {
      yss.helper('fillBorder', (y, color) => {
        return y`
          fill: ${color}
          border: ${color}
        `
      })
      o(
        yss`
          fillBorder: brick
        `.style
      ).deepEquals({
        fill: 'brick',
        border: 'brick',
      })
    })

    o('allow overwrite when helper used as string', () => {
      yss.helper('fillBorder', (y, color) => {
        return y`
          fill: ${color}
          border: ${color}
        `
      })
      o(
        yss`
          fillBorder: brick
          border: green
        `.style
      ).deepEquals({
        fill: 'brick',
        border: 'green',
      })
    })
  })
})
