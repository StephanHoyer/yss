# yss - why style sheets?

![](http://img.badgesize.io/StephanHoyer/yss/master/index.js.svg?compression=gzip)

## What is *yss*?

Given that you use the mighty [mithril.js](https://mithril.js.org) wouldn't it be great to be able to do something like this:

```
m('a' + yss.fsL.dIb.bgBlue.fgWhite.brPill.boNone.hoGrow.ulNone, { href: '#' }, 'Click me')
```

or even

```
const f = (tag, className) => (...args) => m(tag + className, ...args)
const myStyledButtonLink = f('a', yss.fsL.dIb.bgBlue.fgWhite.brPill.boNone.hoGrow.ulNone)

myStyledButtonLink({ href: '#' }, 'Click me')
```

Well with *yss* this will be possible.

Heavily inspired by https://github.com/porsager/bss. Thanks Rasmus!

