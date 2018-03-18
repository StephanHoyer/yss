const m = require('mithril')
const yss = require('../index')()
const pseudo = require('../helpers/pseudo')
const { nest, media, animate } = require('../helpers')

pseudo(yss, 'hover')
pseudo(yss, 'focus')

yss.helper('nest', nest)
yss.helper('media', media)
yss.helper('animate', animate)

function defaultUnit(property, fallbackUnit = 'rem') {
  return (y, value, unit = fallbackUnit) => y`${property} ${value}${unit}`
}

yss.helper({
  hoverDarken: y => y.hover('background', 'dark' + y.style.background),
  flex: (y, alignItems = 'center', justifyContent = 'center') => {
    y`display flex`({ alignItems, justifyContent })
  },
  bn: 'border none',

  // font style
  i: 'fontStyle italic',
  b: 'fontWeight bold',
  underline: 'textDecoration underline',
  strike: 'textDecoration line-through',
  ttc: 'textTransform capitalize',
  ttu: 'textTransform uppercase',

  // font size
  fs: defaultUnit('fontSize'),
  fs1: y => y.fs(3),
  fs2: y => y.fs(2.25),
  fs3: y => y.fs(1.5),
  fs4: y => y.fs(1.25),
  fs5: y => y.fs(1),
  fs6: y => y.fs(0.875),

  // border radius
  br: defaultUnit('borderRadius'),
  br0: y => y.br(0),
  br1: y => y.br(1 / 4),
  br2: y => y.br(1 / 2),
  br3: y => y.br(1 / 1),
  br4: y => y.br(2 / 1),
  brTop: 'borderBottomLeftRadius:0;borderBottomRightRadius:0',
  brLeft: 'borderTopRightRadius:0;borderBottomRightRadius:0',
  brRight: 'borderTopLeftRadius:0;borderBottomLeftRadius:0',
  brBottom: 'borderTopLeftRadius:0;borderTopRightRadius:0',
  round: y => y.br(1000),

  // padding
  pl: defaultUnit('paddingLeft'),
  pl0: y => y.pl(0),
  pl1: y => y.pl(1 / 4),
  pl2: y => y.pl(1 / 2),
  pl3: y => y.pl(1 / 1),
  pl4: y => y.pl(2 / 1),
  pr: defaultUnit('paddingRight'),
  pr0: y => y.pr(0),
  pr1: y => y.pr(1 / 4),
  pr2: y => y.pr(1 / 2),
  pr3: y => y.pr(1 / 1),
  pr4: y => y.pr(2 / 1),
  pt: defaultUnit('paddingTop'),
  pt0: y => y.pt(0),
  pt1: y => y.pt(1 / 4),
  pt2: y => y.pt(1 / 2),
  pt3: y => y.pt(1 / 1),
  pt4: y => y.pt(2 / 1),
  pb: defaultUnit('paddingBottom'),
  pb0: y => y.pb(0),
  pb1: y => y.pb(1 / 4),
  pb2: y => y.pb(1 / 2),
  pb3: y => y.pb(1 / 1),
  pb4: y => y.pb(2 / 1),
  pv0: y => y.pt0.pb0,
  pv1: y => y.pt1.pb1,
  pv2: y => y.pt2.pb2,
  pv3: y => y.pt3.pb3,
  pv4: y => y.pt4.pb4,
  ph0: y => y.pl0.pr0,
  ph1: y => y.pl1.pr1,
  ph2: y => y.pl2.pr2,
  ph3: y => y.pl3.pr3,
  ph4: y => y.pl4.pr4,

  // dimensions
  w: defaultUnit('width'),
  h: defaultUnit('height'),
  size: (y, value, unit) => y.w(value, unit).h(value, unit),

  // misc
  bg: (y, color) => y('background', color),
})

yss.helper(
  'button',
  (y, background) =>
    y.flex.bn.round.ttu.i.fs1.pv3.ph4`
  color white
  transition background 0.2s ease-in-out
  background ${background}
`.focus`outline: none`.hoverDarken
)

const blueButton = 'button' + yss.button('blue')
const greenButton = 'button' + yss.button('green')

document.body.classList.add(('' + yss.flex).replace(/^./, ''))

const list = 'ul' + yss.nest('li', yss.bg('green').hover(yss.bg('red')))
const responsiveDiv =
  'div' +
  yss
    .size(5)
    .bg('red')
    .media('(max-width: 1000px)', yss.bg('green'))

const rainbow = {
  '0%': yss.bg('green'),
  '30%': yss.bg('blue'),
  '60%': yss.bg('red'),
  '100%': yss.bg('green'),
}

const bwAnimation = {
  '0%': yss.bg('black'),
  '50%': yss.bg('white'),
  '100%': yss.bg('black'),
}

const zebraDiv =
  'div' +
  yss.size(5).animate('10s infinite', bwAnimation)`transition background 1s`
const discoDiv =
  'div' + yss.size(5).animate('9s infinite', rainbow)`transition background 1s`
const anotherDiscoDiv =
  'div' + yss.size(5).animate('10s infinite', rainbow)`transition background 1s`

m.mount(document.body, {
  on: true,
  view({ state }) {
    return [
      m('style', yss.css),
      m(
        state.on ? greenButton : blueButton,
        {
          onclick: () => (state.on = !state.on),
        },
        'clickme'
      ),
      m(list, m('li', 'some list')),
      m(responsiveDiv),
      m(discoDiv),
      m(zebraDiv),
      m(anotherDiscoDiv),
    ]
  },
})
