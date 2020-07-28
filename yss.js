(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Yss = factory());
}(this, (function () { 'use strict';

  var KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

  function kebabCase(str) {
    return str.replace(KEBAB_REGEX, function (match) { return ("-" + (match.toLowerCase())); })
  }

  function camelize(s) {
    return s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
  }

  function cleanSplit(s, regExp) {
    return s
      .split(regExp)
      .map(function (a) { return a.trim(); })
      .filter(function (a) { return a; })
  }

  function isObject(thing) {
    return typeof thing === 'object'
  }

  function toAlphabetNumber(number) {
    return number.toString(36)
  }

  function getClassName(n) {
    return '.y' + toAlphabetNumber(n)
  }

  var keys = Object.keys;
  function map(obj, fn) {
    return Object.keys(obj).map(function (key) { return fn(obj[key], key); })
  }

  function isAttr(attr) {
    return attr[0] !== ':' && attr[0] !== ' ' && attr[0] !== '@'
  }

  function isSubselector(attr) {
    return attr[0] === ':' || attr[0] === ' '
  }

  function isMediaQuery(attr) {
    return attr[0] === '@'
  }

  var animationNameByStyle = {};
  var animationCounter = 0;
  function render(style) {
    var usedAnimations = {};
    function toCssDefinition(cssClass, style) {
      var baseStyle = keys(style)
        .filter(isAttr)
        .map(function (attr) {
          var value = style[attr];
          if (attr === 'animation') {
            var frameStyles = style[attr].frameStyles;
            var animationStyle = map(frameStyles, function (y, frameName) { return toCssDefinition(frameName, y.style); }
            ).join('');
            if (!animationNameByStyle[animationStyle]) {
              animationNameByStyle[animationStyle] =
                'a' + toAlphabetNumber(animationCounter++);
            }
            usedAnimations[animationStyle] = animationNameByStyle[animationStyle];
            value = (style[attr].timing || '') + " " + (animationNameByStyle[animationStyle]);
          }
          return ((kebabCase(attr)) + ":" + value)
        })
        .join(';');
      var subStyles = keys(style)
        .filter(isSubselector)
        .map(function (pseudo) { return toCssDefinition(cssClass + pseudo, style[pseudo].style); })
        .join('');
      var mediaStyles = keys(style)
        .filter(isMediaQuery)
        .map(
          function (mediaQuery) { return (mediaQuery + "{" + (toCssDefinition(
              ("" + cssClass),
              style[mediaQuery].style
            )) + "}"); }
        )
        .join('');
      return (cssClass + "{" + baseStyle + "}" + subStyles + mediaStyles)
    }

    var styles = keys(style)
      .map(function(cssClass) {
        return ("" + (toCssDefinition(cssClass, style[cssClass])))
      })
      .join('');
    var keyframes = map(
      usedAnimations,
      function (name, keyframeStyle) { return ("@keyframes " + name + "{" + keyframeStyle + "}"); }
    ).join('');
    return keyframes + styles
  }

  function nest(y, selector, style) {
    y.style[(" " + selector)] = y.yss(style);
  }

  function media(y, def, style) {
    y.style[("@media " + def)] = y.yss(style);
  }

  function animate(y, timing, frameStyles) {
    y.style.animation = { frameStyles: frameStyles, timing: timing };
  }

  function pseudo(yss, name, helperName) {
    if ( helperName === void 0 ) helperName = name;

    var selector = ":" + name;
    yss.helper(helperName, function (y, key) {
      var ref;

      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
      if (!y.style[selector] || !y.style[selector].style) {
        y.style[selector] = yss(y.style[selector]);
      }
      (ref = y.style)[selector].apply(ref, [ key ].concat( args ));
    });
  }

  var classCounter = 0;
  function Yss(opts) {
    if ( opts === void 0 ) opts = {};

    var classNamesByStyle = {};
    opts = Object.assign(
      {
        getClassName: getClassName,
        render: render,
      },
      opts
    );

    // this is the prototype of a styling instance.
    var baseInstance = {
      get class() {
        var serializedStyle = JSON.stringify(this.style);
        var existingClassname = classNamesByStyle[serializedStyle];
        if (existingClassname) {
          return existingClassname
        }
        var className = opts.getClassName(classCounter++, this.style);
        classNamesByStyle[serializedStyle] = className;
        yss.style[className] = this.style;
        return className
      },
      toString: function() {
        return this.class
      },
      toJSON: function() {
        return this.style
      },
    };
    Object.setPrototypeOf(baseInstance, function() {});

    function parseStyle(styleInstance, key) {
      var obj;

      var args = [], len = arguments.length - 2;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];
      if (typeof key === 'string' && !args[0]) {
        // plain string, parse like template string
        key = [key];
      }
      if (Array.isArray(key)) {
        // template string
        // fold string array with args
        var string = key
          .map(function (part, i) { return part + (args[i] == null ? '' : args[i]); })
          .join('');
        // build style object
        return cleanSplit(string, /[;\n]/).reduce(function (style, row) {
          var ref = cleanSplit(row, /[ :]/);
          var key = ref[0];
          var value = ref.slice(1);
          var prop = camelize(key);
          // if there is a helper with prop name, use it
          if (styleInstance[prop]) {
            styleInstance[prop].apply(styleInstance, value);
          } else {
            style[prop] = value.join(' ');
          }
          return style
        }, {})
      }
      if (key && key.style) {
        // merge instances
        return key.style
      }
      if (args[0]) {
        // key/value definition
        return ( obj = {}, obj[key] = args[0], obj )
      }
      return key // object
    }

    // this creates a styling instance and hooks the upper prototype to it
    function yss() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      function styleInstance() {
        var styleArgs = [], len = arguments.length;
        while ( len-- ) styleArgs[ len ] = arguments[ len ];

        Object.assign(
          styleInstance.style,
          parseStyle.apply(void 0, [ styleInstance ].concat( styleArgs ))
        );
        return styleInstance
      }
      styleInstance.style = {};
      styleInstance.yss = yss;
      Object.setPrototypeOf(styleInstance, baseInstance);
      return styleInstance.apply(void 0, args)
    }

    yss.style = {};
    Object.defineProperty(yss, 'css', {
      get: function () { return opts.render(yss.style); },
    });

    // this is the function to create helpers. Helpers are attached to the prototype of the styling
    // instances and to yss itself. When called on yss, they automatically create an instance and
    // and call the helpers on them right away
    yss.helper = function(name) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

      if (isObject(name)) {
        // define multiple helpers at once
        var helpers = name;
        for (name in helpers) {
          yss.helper(name, helpers[name]);
        }
        return
      }
      var fn = args[0];
      if (
        typeof args[0] === 'string' ||
        Array.isArray(args[0]) ||
        args[0].style
      ) {
        fn = function (y) { return y.apply(void 0, args); };
      }
      if (fn.length === 1) {
        // set to baseInstance
        Object.defineProperty(baseInstance, name, {
          get: function() {
            fn(this);
            return this
          },
        });
        // set to yss itself
        Object.defineProperty(yss, name, {
          // create an instance and call helper right away
          get: function () { return yss({})[name]; },
        });
      } else {
        // set to baseInstance
        baseInstance[name] = function() {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          fn.apply(void 0, [ this ].concat( args ));
          return this
        };
        // set to yss itself
        yss[name] = function () {
          var ref;

          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];
          return (ref = yss({}))[name].apply(ref, args);
        };
      }
    };

    // add default helpers
    yss.helper('nest', nest);
    yss.helper('media', media);
    yss.helper('animate', animate);
    pseudo(yss, 'hover');
    pseudo(yss, 'focus');

    return yss
  }

  return Yss;

})));
//# sourceMappingURL=yss.js.map
