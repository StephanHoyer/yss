const o = require('ospec')
const yss = require('..')

o.spec('create style instance', () => {
  o('two args', () => {
    o(yss('color', 'purple').style).deepEquals({color: 'purple'})
  })

  // todo template strings with args
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
      borderRadius: '1rem 2rem 3rem 4rem'
    })
  })

  o('template strings with vars', () => {
    o(yss`top ${123}px`.style).deepEquals({top: '123px'})
  })

  o('object', () => {
    o(yss({fill: 'red'}).style).deepEquals({fill: 'red'})
  })

  o('plain strings', () => {
    o(yss('fill: red;color orange').style).deepEquals({
      fill: 'red',
      color: 'orange'
    })
  })
})

o.spec('chaining', () => {
  o('combine multiple calls', () => {
    o(yss({fill: 'red'})({border: 'green'})`color yellow`.style).deepEquals({
      fill: 'red',
      border: 'green',
      color: 'yellow'
    })
  })

  o('overwrite', () => {
    o(yss({fill: 'blue'})`fill red`.style).deepEquals({fill: 'red'})
  })

  o('merge instances', () => {
    o(yss({fill: 'blue'})(yss`fill red`).style).deepEquals({fill: 'red'})
  })
})

o('css classes and global style', () => {
  const y1 = yss({fill: 'rose'})
  const y2 = yss({fill: 'gold'})
  o(y1.class).equals('.someClass0')
  o(y2.class).equals('.someClass1')
  o(yss.style).deepEquals({
    someClass0: { fill: 'rose' },
    someClass1: { fill: 'gold' }
  })
})

o.spec('helper', () => {
  o('without args', () => {
    yss.helper('fillOlive', y => y`fill: olive`)
    o(yss.fillOlive.style).deepEquals({ fill: 'olive' })
  })

  o('with args', () => {
    yss.helper('fill', (y, color) => y({fill: color}))
    o(yss.fill('karmin').style).deepEquals({ fill: 'karmin' })
  })

  o('helper uses other helper', () => {
    yss.helper('awesome', y => y('color', 'white').fillOlive)
    o(yss.awesome({border: 'none'}).style).deepEquals({
      fill: 'olive',
      color: 'white',
      border: 'none'
    })
  })
})

o.spec('pseudo classes', () => {
  yss.helper('$hover', (y, hoverStyle) => { // / todo support multiple args
    if (!y.style.$hover || !y.style.$hover.style) {
      y.style.$hover = yss(y.style.$hover)
    }
    y.style.$hover(hoverStyle)
  })

  o('add hover style', () => {
    const y = yss.$hover(yss({color: 'black'}))
    o(y.style.$hover.style).deepEquals({color: 'black'})
  })

  o('multiple hover style', () => {
    o(yss({ $hover: { display: 'inline' } }).$hover({ color: 'brown' }).style.$hover.style).deepEquals({
      display: 'inline',
      color: 'brown'
    })
  })

  o('helper that adds hover', () => {
    yss.helper('bgBlue', y => y`background blue`)
    yss.helper('hoverDarken', y => y.$hover(yss('background', `dark${y.style.background}`)))
    o(yss.bgBlue.hoverDarken.style.background).equals('blue')
    o(yss.bgBlue.hoverDarken.style.$hover.style.background).equals('darkblue')
  })

  o('merge pseudos', () => {
    const y = yss.$hover(yss({background: 'red'})).$hover(yss({color: 'green'})).$hover`fill red`
    o(y.style.$hover.style).deepEquals({
      background: 'red',
      color: 'green',
      fill: 'red'
    })
  })
})
