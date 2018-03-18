# yss - why style sheets?

![](http://img.badgesize.io/StephanHoyer/yss/master/yss.min.js.svg?compression=gzip)

## What is _yss_?

Given that you use the mighty [mithril.js](https://mithril.js.org) wouldn't it be great to be able to do something like this:

```
m('a' + yss.fsL.dIb.bgBlue.fgWhite.brPill.boNone.hoGrow.ulNone, { href: '#' }, 'Click me')
```

or

```
const f = (tag, className) => (...args) => m(tag + className, ...args)
const myStyledButtonLink = f('a', yss.fsL.dIb.bgBlue.fgWhite.brPill.boNone.hoGrow.ulNone)

myStyledButtonLink({ href: '#' }, 'Click me')
```

or even

```
a.fsL.dIb.bgBlue.fgWhite.brPill.boNone.hoGrow.ulNone({ href: '#' }, 'Click me')
```

Well with _yss_ this might be possible.

Heavily inspired by https://github.com/porsager/bss. Thanks Rasmus!
