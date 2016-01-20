/**
 * @license
 * lodash 4.0.0-pre <https://lodash.com/>
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function () {
  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.0.0-pre';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG          = 1,
      BIND_KEY_FLAG      = 2,
      CURRY_BOUND_FLAG   = 4,
      CURRY_FLAG         = 8,
      CURRY_RIGHT_FLAG   = 16,
      PARTIAL_FLAG       = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG           = 128,
      REARG_FLAG         = 256,
      FLIP_FLAG          = 512;

  /** Used to compose bitmasks for comparison styles. */
  var UNORDERED_COMPARE_FLAG = 1,
      PARTIAL_COMPARE_FLAG   = 2;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH   = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 150,
      HOT_SPAN  = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG    = 2,
      LAZY_WHILE_FLAG  = 3;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as references for various `Number` constants. */
  var INFINITY         = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER      = 1.7976931348623157e+308,
      NAN              = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH      = 4294967295,
      MAX_ARRAY_INDEX       = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag    = '[object Arguments]',
      arrayTag   = '[object Array]',
      boolTag    = '[object Boolean]',
      dateTag    = '[object Date]',
      errorTag   = '[object Error]',
      funcTag    = '[object Function]',
      genTag     = '[object GeneratorFunction]',
      mapTag     = '[object Map]',
      numberTag  = '[object Number]',
      objectTag  = '[object Object]',
      regexpTag  = '[object RegExp]',
      setTag     = '[object Set]',
      stringTag  = '[object String]',
      symbolTag  = '[object Symbol]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag  = '[object ArrayBuffer]',
      float32Tag      = '[object Float32Array]',
      float64Tag      = '[object Float64Array]',
      int8Tag         = '[object Int8Array]',
      int16Tag        = '[object Int16Array]',
      int32Tag        = '[object Int32Array]',
      uint8Tag        = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag       = '[object Uint16Array]',
      uint32Tag       = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading  = /\b__p \+= '';/g,
      reEmptyStringMiddle   = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml      = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml    = /[&<>"'`]/g,
      reHasEscapedHtml   = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape      = /<%-([\s\S]+?)%>/g,
      reEvaluate    = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp  = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName    = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

  /** Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns). */
  var reRegExpChar    = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0x/i;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange  = '\\ud800-\\udfff',
      rsComboRange   = '\\u0300-\\u036f\\ufe20-\\ufe23',
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange   = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange  = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsQuoteRange   = '\\u2018\\u2019\\u201c\\u201d',
      rsSpaceRange   = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange   = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange     = '\\ufe0e\\ufe0f',
      rsBreakRange   = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsAstral    = '[' + rsAstralRange + ']',
      rsBreak     = '[' + rsBreakRange + ']',
      rsCombo     = '[' + rsComboRange + ']',
      rsDigits    = '\\d+',
      rsDingbat   = '[' + rsDingbatRange + ']',
      rsLower     = '[' + rsLowerRange + ']',
      rsMisc      = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsModifier  = '(?:\\ud83c[\\udffb-\\udfff])',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional  = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair  = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper     = '[' + rsUpperRange + ']',
      rsZWJ       = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
      rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
      reOptMod    = rsModifier + '?',
      rsOptVar    = '[' + rsVarRange + ']?',
      rsOptJoin   = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq       = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji     = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol    = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reComplexSymbol = RegExp(rsSymbol + rsSeq, 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasComplexSymbol = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');

  /** Used to match non-compound words composed of alphanumeric characters. */
  var reBasicWord = /[a-zA-Z0-9]+/g;

  /** Used to match complex or compound words. */
  var reComplexWord = RegExp([
    rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
    rsUpper + '?' + rsLowerMisc + '+',
    rsDigits + '(?:' + rsLowerMisc + '+)?',
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function',
    'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_',
    'clearTimeout', 'isFinite', 'parseFloat', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags         = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
      typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
        typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
          typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
      typedArrayTags[dateTag] = typedArrayTags[errorTag] =
        typedArrayTags[funcTag] = typedArrayTags[mapTag] =
          typedArrayTags[numberTag] = typedArrayTags[objectTag] =
            typedArrayTags[regexpTag] = typedArrayTags[setTag] =
              typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags      = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
      cloneableTags[dateTag] = cloneableTags[float32Tag] =
        cloneableTags[float64Tag] = cloneableTags[int8Tag] =
          cloneableTags[int16Tag] = cloneableTags[int32Tag] =
            cloneableTags[mapTag] = cloneableTags[numberTag] =
              cloneableTags[objectTag] = cloneableTags[regexpTag] =
                cloneableTags[setTag] = cloneableTags[stringTag] =
                  cloneableTags[symbolTag] = cloneableTags[uint8Tag] =
                    cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] =
                      cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A', '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a', '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C', '\xe7': 'c',
    '\xd0': 'D', '\xf0': 'd',
    '\xc8': 'E', '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e', '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I', '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i', '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N', '\xf1': 'n',
    '\xd2': 'O', '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o', '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U', '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u', '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y', '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;' : '&',
    '&lt;'  : '<',
    '&gt;'  : '>',
    '&quot;': '"',
    '&#39;' : "'",
    '&#96;' : '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object'  : true
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\'    : '\\',
    "'"     : "'",
    '\n'    : 'n',
    '\r'    : 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry (map, pair) {
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry (set, value) {
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply (func, thisArg, args) {
    var length = args ? args.length : 0;
    switch (length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * Creates a new array concatenating `array` with `other`.
   *
   * @private
   * @param {Array} array The first array to concatenate.
   * @param {Array} other The second array to concatenate.
   * @returns {Array} Returns the new concatenated array.
   */
  function arrayConcat (array, other) {
    var index     = -1,
        length    = array.length,
        othIndex  = -1,
        othLength = other.length,
        result    = Array(length + othLength);

    while (++index < length) {
      result[index] = array[index];
    }
    while (++othIndex < othLength) {
      result[index++] = other[othIndex];
    }
    return result;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @returns {Array} Returns `array`.
   */
  function arrayEach (array, iteratee) {
    var index  = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight (array, iteratee) {
    var length = array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate 这个函数会处理每一个元素
   * @returns {boolean} Returns `true` if all elements pass the predicate check否则返回 `false`
   */
  function arrayEvery (array, predicate) {
    var index  = -1,
        length = array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate 这个函数会处理每一个元素
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter (array, predicate) {
    var index    = -1,
        length   = array.length,
        resIndex = -1,
        result   = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target 要检索的值
   * @returns {boolean} Returns `true` if `target` is found否则返回 `false`
   */
  function arrayIncludes (array, value) {
    return !!array.length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * A specialized version of `_.includesWith` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} target 要检索的值
   * @param {Function} comparator 这个函数会处理每一个元素
   * @returns {boolean} Returns `true` if `target` is found否则返回 `false`
   */
  function arrayIncludesWith (array, value, comparator) {
    var index  = -1,
        length = array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for callback
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap (array, iteratee) {
    var index  = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush (array, values) {
    var index  = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initFromArray] Specify using the first element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce (array, iteratee, accumulator, initFromArray) {
    var index  = -1,
        length = array.length;

    if (initFromArray && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initFromArray] Specify using the last element of `array` as the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight (array, iteratee, accumulator, initFromArray) {
    var length = array.length;
    if (initFromArray && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for callback
   * shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate 这个函数会处理每一个元素
   * @returns {boolean} Returns `true` if any element passes the predicate check否则返回 `false`
   */
  function arraySome (array, predicate) {
    var index  = -1,
        length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * The base implementation of methods like `_.max` and `_.min` which accepts a
   * `comparator` to determine the extremum value.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The iteratee invoked per iteration.
   * @param {Function} comparator The comparator used to compare values.
   * @returns {*} Returns the extremum value.
   */
  function baseExtremum (array, iteratee, comparator) {
    var index  = -1,
        length = array.length;

    while (++index < length) {
      var value   = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? current === current
            : comparator(current, computed)
        )) {
        var computed = current,
            result   = value;
      }
    }
    return result;
  }

  /**
   * The base implementation of methods like `_.find` and `_.findKey`, without
   * support for callback shorthands, which iterates over `collection` using
   * the provided `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection 要检索的集合
   * @param {Function} predicate 这个函数会处理每一个元素
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind (collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function (value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate 这个函数会处理每一个元素
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex (array, predicate, fromRight) {
    var length = array.length,
        index  = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value 要检索的值
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf (array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index  = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for callback shorthands, which iterates over `collection` using the provided
   * `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection 需要遍历的集合
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @param {*} accumulator The initial value.
   * @param {boolean} initFromCollection Specify using the first or last element of `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce (collection, iteratee, accumulator, initFromCollection, eachFunc) {
    eachFunc(collection, function (value, index, collection) {
      accumulator = initFromCollection
        ? (initFromCollection = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define
   * the sort order of `array` and replaces criteria objects with their
   * corresponding values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy (array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` without support for callback shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @returns {number} Returns the sum.
   */
  function baseSum (array, iteratee) {
    var result,
        index  = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for callback shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee 这个函数会处理每一个元素
   * @returns {Array} Returns the array of results.
   */
  function baseTimes (n, iteratee) {
    var index  = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object 要检索的对象
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the new array of key-value pairs.
   */
  function baseToPairs (object, props) {
    return arrayMap(props, function (key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim` without support trimming non-whitespace
   * characters.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim (string) {
    return string
      ? string.slice(trimmedStartIndex(string), trimmedEndIndex(string) + 1)
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing wrapper metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new function.
   */
  function baseUnary (func) {
    return function (value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object 要检索的对象
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues (object, props) {
    return arrayMap(props, function (key) {
      return object[key];
    });
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex (strSymbols, chrSymbols) {
    var index  = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex (strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }

  /**
   * 检查 `value` 是否是 a global object.
   *
   * @private
   * @param {*} value 要检查的值
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal (value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Compares values to sort them in ascending order.
   *
   * @private
   * @param {*} value 要比较的值
   * @param {*} other 其他要比较的值
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function compareAscending (value, other) {
    if (value !== other) {
      var valIsNull      = value === null,
          valIsUndef     = value === undefined,
          valIsReflexive = value === value;

      var othIsNull      = other === null,
          othIsUndef     = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
        (valIsNull && !othIsUndef && othIsReflexive) ||
        (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
        (othIsNull && !valIsUndef && valIsReflexive) ||
        (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * Used by `_.orderBy` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
   * specify an order of "desc" for descending or "asc" for ascending sort order
   * of corresponding values.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]|string[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple (object, other, orders) {
    var index        = -1,
        objCriteria  = object.criteria,
        othCriteria  = other.criteria,
        length       = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == 'desc' ? -1 : 1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // 了解详情
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 了解详情
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter (letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar (chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar (chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN (array, fromIndex, fromRight) {
    var length = array.length,
        index  = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * 检查 `value` 是否是 a host object in IE < 9.
   *
   * @private
   * @param {*} value 要检查的值
   * @returns {boolean} Returns `true` if `value` is a host object否则返回 `false`
   */
  function isHostObject (value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {
      }
    }
    return result;
  }

  /**
   * 检查 `value` 是否是 a valid array-like index.
   *
   * @private
   * @param {*} value 要检查的值
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index否则返回 `false`
   */
  function isIndex (value, length) {
    value  = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Used by `trimmedStartIndex` and `trimmedEndIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace否则返回 `false`
   */
  function isSpace (charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
    (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray (iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to an array.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the converted array.
   */
  function mapToArray (map) {
    var index  = -1,
        result = Array(map.size);

    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders (array, placeholder) {
    var index    = -1,
        length   = array.length,
        resIndex = -1,
        result   = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index]       = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the converted array.
   */
  function setToArray (set) {
    var index  = -1,
        result = Array(set.size);

    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * 获得字符串的长度
   *
   * @param {string} string 要处理的字符串
   * @returns {number} 返回字符串长度
   */
  function stringSize (string) {
    if (!(string && reHasComplexSymbol.test(string))) {
      return string.length;
    }
    var result = reComplexSymbol.lastIndex = 0;
    while (reComplexSymbol.test(string)) {
      result++;
    }
    return result;
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string 要转换的字符串
   * @returns {Array} Returns the converted array.
   */
  function stringToArray (string) {
    return string.match(reComplexSymbol);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedStartIndex (string) {
    var index  = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {
    }
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex (string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {
    }
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar (chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext (context) {
    context = context ? _.defaults({}, context, _.pick(root, contextProps)) : root;

    /** Built-in constructor references. */
    var Date      = context.Date,
        Error     = context.Error,
        Math      = context.Math,
        RegExp    = context.RegExp,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto  = context.Array.prototype,
        objectProto = context.Object.prototype,
        stringProto = context.String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = context.Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
        .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Reflect               = context.Reflect,
        Symbol                = context.Symbol,
        Uint8Array            = context.Uint8Array,
        clearTimeout          = context.clearTimeout,
        enumerate             = Reflect ? Reflect.enumerate : undefined,
        getPrototypeOf        = Object.getPrototypeOf,
        getOwnPropertySymbols = Object.getOwnPropertySymbols,
        iteratorSymbol        = typeof (iteratorSymbol = Symbol && Symbol.iterator) == 'symbol' ? iteratorSymbol : undefined,
        parseFloat            = context.parseFloat,
        pow                   = Math.pow,
        propertyIsEnumerable  = objectProto.propertyIsEnumerable,
        setTimeout            = context.setTimeout,
        splice                = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil     = Math.ceil,
        nativeFloor    = Math.floor,
        nativeIsFinite = context.isFinite,
        nativeJoin     = arrayProto.join,
        nativeKeys     = Object.keys,
        nativeMax      = Math.max,
        nativeMin      = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom   = Math.random,
        nativeReverse  = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var Map          = getNative(context, 'Map'),
        Set          = getNative(context, 'Set'),
        WeakMap      = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to detect maps and sets. */
    var mapCtorString = Map ? funcToString.call(Map) : '',
        setCtorString = Set ? funcToString.call(Set) : '';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto    = Symbol ? Symbol.prototype : undefined,
        symbolValueOf  = Symbol ? symbolProto.valueOf : undefined,
        symbolToString = Symbol ? symbolProto.toString : undefined;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * 创建一个经 `lodash` 包装后的对象会启用隐式链。返回的数组、集合、方法相互之间能够链式调用。
     * 检索唯一值或返回原始值会自动解除链条并返回计算后的值，否则需要调用 `_#value` 方法解除链(即获得计算结果)。
     *
     * 显式链式调用，在任何情况下需要先用 `_#value` 解除链后，才能使用 `_.chain` 开启。
     *
     * 链式方法是惰性计算的，直到隐式或者显式调用了 `_#value` 才会执行计算。
     *
     * 惰性计算接受几种支持 shortcut fusion 的方法，shortcut fusion 是一种通过合并链式 iteratee 调用从而大大降低迭代的次数以提高执行性能的方式。
     * Sections of a chain sequence qualify for shortcut fusion if the section is
     * applied to an array of at least two hundred elements and any iteratees
     * accept only one argument. The heuristic for whether a section qualifies
     * for shortcut fusion is subject to change.
     *
     * 链式方法支持定制版本，只要 `_#value` 包含或者间接包含在版本中。
     *
     * 除了 lodash 的自身方法，包装后的对象还支持  `Array` 的 `String` 的方法。
     *
     * 支持 `Array` 的方法:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, 以及 `unshift`
     *
     * 支持 `String` 的方法:
     * `replace` 以及 `split`
     *
     * 支持 shortcut fusion 的方法:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, 以及 `toArray`
     *
     * 默认不支持 链式调用 的方法:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `deburr`, `endsWith`, `eq`,
     * `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
     * `findLast`, `findLastIndex`, `findLastKey`, `floor`, `get`, `gt`, `gte`,
     * `has`, `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`,
     * `invoke`, `isArguments`, `isArray`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isEqualWith`,
     * `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`, `isMatch`,
     * `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`, `isNumber`,
     * `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`, `isSafeInteger`,
     * `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`, `last`,
     * `lastIndexOf`, `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`,
     * `mean`, `min`, `minBy`, `noConflict`, `noop`, `now`, `pad`, `padEnd`,
     * `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`, `repeat`,
     * `result`, `round`, `runInContext`, `sample`, `shift`, `size`, `snakeCase`,
     * `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`, `sortedLastIndexBy`,
     * `startCase`, `startsWith`, `subtract`, `sum`, sumBy`, `template`, `times`,
     * `toLower`, `toInteger`, `toLength`, `toNumber`, `toSafeInteger`, toString`,
     * `toUpper`, `trim`, `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`,
     * `upperCase`, `upperFirst`, `value`, 以及 `words`
     * 
     * 支持 链式调用 的方法:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`,
     * `at`, `before`, `bind`, `bindAll`, `bindKey`, `chain`, `chunk`, `commit`,
     * `compact`, `concat`, `conforms`,  `constant`, `countBy`, `create`, `curry`,
     * `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`, `difference`,
     * `differenceBy`, `differenceWith`,  `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flip`, `flow`,
     * `flowRight`, `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`,
     * `forOwnRight`, `fromPairs`, `functions`, `functionsIn`, `groupBy`, `initial`,
     * `intersection`, `intersectionBy`, `intersectionWith`, invert`, `invokeMap`,
     * `iteratee`, `keyBy`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`,
     * `matches`, `matchesProperty`, `memoize`, `merge`, `mergeWith`, `method`,
     * `methodOf`, `mixin`, `negate`, `nthArg`, `omit`, `omitBy`, `once`, `orderBy`,
     * `over`, `overArgs`, `overEvery`, `overSome`, `partial`, `partialRight`,
     * `partition`, `pick`, `pickBy`, `plant`, `property`, `propertyOf`, `pull`,
     * `pullAll`, `pullAllBy`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`,
     * `reject`, `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`,
     * `shuffle`, `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`,
     * `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`,
     * `toArray`, `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`,
     * `unary`, `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`,
     * `unset`, `unshift`, `unzip`, `unzipWith`, `values`, `valuesIn`, `without`,
     * `wrap`, `xor`, `xorBy`, `xorWith`, `zip`, `zipObject`, 以及 zipWith　　　　　
 
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value 需要被包装为 `lodash` 实例的值.
     * @returns {Object} 返回 `lodash` 包装后的实例
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // 返回未包装的值
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // 返回链式包装的值
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash (value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash () {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     */
    function LodashWrapper (value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__   = !!chainAll;
      this.__index__   = 0;
      this.__values__  = undefined;
    }

    /**
     * 默认情况下，这些都是用于处理lodash的模板，类似 Ruby 的嵌入式 (ERB)。
     * 可以改变接下来的设置用新的方式代替。
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * 用于检测要进行HTML转义 `data` 的属性值。
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * 用于检测表达式代码
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * 用于检测要插入的 `data` 的属性值。
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * 用于引用模板文本中的 `data` 对象
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * 用于导入变量到编译模板
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * `lodash` 函数的引用
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper (value) {
      this.__wrapped__   = value;
      this.__actions__   = [];
      this.__dir__       = 1;
      this.__filtered__  = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__     = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone () {
      var result           = new LazyWrapper(this.__wrapped__);
      result.__actions__   = copyArray(this.__actions__);
      result.__dir__       = this.__dir__;
      result.__filtered__  = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__     = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse () {
      if (this.__filtered__) {
        var result          = new LazyWrapper(this);
        result.__dir__      = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue () {
      var array      = this.__wrapped__.value(),
          dir        = this.__dir__,
          isArr      = isArray(array),
          isRight    = dir < 0,
          arrLength  = isArr ? array.length : 0,
          view       = getView(0, arrLength, this.__views__),
          start      = view.start,
          end        = view.end,
          length     = end - start,
          index      = isRight ? end : (start - 1),
          iteratees  = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex   = 0,
          takeCount  = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
        while (length-- && resIndex < takeCount) {
          index += dir;

          var iterIndex = -1,
              value     = array[index];

          while (++iterIndex < iterLength) {
            var data     = iteratees[iterIndex],
                iteratee = data.iteratee,
                type     = data.type,
                computed = iteratee(value);

            if (type == LAZY_MAP_FLAG) {
              value = computed;
            } else if (!computed) {
              if (type == LAZY_FILTER_FLAG) {
                continue outer;
              } else {
                break outer;
              }
            }
          }
          result[resIndex++] = value;
        }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an hash object.
     *
     * @private
     * @returns {Object} Returns the new hash object.
     */
    function Hash () {
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed否则返回 `false`
     */
    function hashDelete (hash, key) {
      return hashHas(hash, key) && delete hash[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet (hash, key) {
      if (nativeCreate) {
        var result = hash[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @param {Object} hash The hash to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists否则返回 `false`
     */
    function hashHas (hash, key) {
      return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of 要设置的值
     * @param {*} value 要设置的值
     */
    function hashSet (hash, key, value) {
      hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function MapCache (values) {
      var index  = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapClear () {
      this.__data__ = {'hash': new Hash, 'map': Map ? new Map : [], 'string': new Hash};
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed否则返回 `false`
     */
    function mapDelete (key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map['delete'](key) : assocDelete(data.map, key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapGet (key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashGet(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.get(key) : assocGet(data.map, key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists否则返回 `false`
     */
    function mapHas (key) {
      var data = this.__data__;
      if (isKeyable(key)) {
        return hashHas(typeof key == 'string' ? data.string : data.hash, key);
      }
      return Map ? data.map.has(key) : assocHas(data.map, key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of 要设置的值
     * @param {*} value 要设置的值
     * @returns {Object} Returns the map cache object.
     */
    function mapSet (key, value) {
      var data = this.__data__;
      if (isKeyable(key)) {
        hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
      } else if (Map) {
        data.map.set(key, value);
      } else {
        assocSet(data.map, key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a set cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache (values) {
      var index  = -1,
          length = values ? values.length : 0;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.push(values[index]);
      }
    }

    /**
     * 检查 `value` 是否是 in `cache`.
     *
     * @private
     * @param {Object} cache The set cache to search.
     * @param {*} value 要检索的值
     * @returns {number} Returns `true` if `value` is found否则返回 `false`
     */
    function cacheHas (cache, value) {
      var map = cache.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        return hash[value] === HASH_UNDEFINED;
      }
      return map.has(value);
    }

    /**
     * Adds `value` to the set cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush (value) {
      var map = this.__data__;
      if (isKeyable(value)) {
        var data = map.__data__,
            hash = typeof value == 'string' ? data.string : data.hash;

        hash[value] = HASH_UNDEFINED;
      }
      else {
        map.set(value, HASH_UNDEFINED);
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function Stack (values) {
      var index  = -1,
          length = values ? values.length : 0;

      this.clear();
      while (++index < length) {
        var entry = values[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear () {
      this.__data__ = {'array': [], 'map': null};
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed否则返回 `false`
     */
    function stackDelete (key) {
      var data  = this.__data__,
          array = data.array;

      return array ? assocDelete(array, key) : data.map['delete'](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet (key) {
      var data  = this.__data__,
          array = data.array;

      return array ? assocGet(array, key) : data.map.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists否则返回 `false`
     */
    function stackHas (key) {
      var data  = this.__data__,
          array = data.array;

      return array ? assocHas(array, key) : data.map.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of 要设置的值
     * @param {*} value 要设置的值
     * @returns {Object} Returns the stack cache object.
     */
    function stackSet (key, value) {
      var data  = this.__data__,
          array = data.array;

      if (array) {
        if (array.length < (LARGE_ARRAY_SIZE - 1)) {
          assocSet(array, key, value);
        } else {
          data.array = null;
          data.map   = new MapCache(array);
        }
      }
      var map = data.map;
      if (map) {
        map.set(key, value);
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Removes `key` and its value from the associative array.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed否则返回 `false`
     */
    function assocDelete (array, key) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = array.length - 1;
      if (index == lastIndex) {
        array.pop();
      } else {
        splice.call(array, index, 1);
      }
      return true;
    }

    /**
     * Gets the associative array value for `key`.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function assocGet (array, key) {
      var index = assocIndexOf(array, key);
      return index < 0 ? undefined : array[index][1];
    }

    /**
     * Checks if an associative array value for `key` exists.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists否则返回 `false`
     */
    function assocHas (array, key) {
      return assocIndexOf(array, key) > -1;
    }

    /**
     * Gets the index at which the first occurrence of `key` is found in `array`
     * of key-value pairs.
     *
     * @private
     * @param {Array} array The array to search.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf (array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Sets the associative array `key` to `value`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {string} key The key of 要设置的值
     * @param {*} value 要设置的值
     */
    function assocSet (array, key, value) {
      var index = assocIndexOf(array, key);
      if (index < 0) {
        array.push([key, value]);
      } else {
        array[index][1] = value;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function assignInDefaults (objValue, srcValue, key, object) {
      if (objValue === undefined ||
        (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * This function is like `assignValue` except that it doesn't assign `undefined` values.
     *
     * @private
     * @param {Object} object 要修改的对象
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue (object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
        (typeof key == 'number' && value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object 要修改的对象
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue (object, key, value) {
      var objValue = object[key];
      if ((!eq(objValue, value) ||
        (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) ||
        (value === undefined && !(key in object))) {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object 目标对象
     * @param {Object} source 来源对象
     * @returns {Object} 返回对象
     */
    function baseAssign (object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {string[]} paths The property paths of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt (object, paths) {
      var index  = -1,
          isNil  = object == null,
          length = paths.length,
          result = Array(length);

      while (++index < length) {
        result[index] = isNil ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone (value, isDeep, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag    = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function (subValue, key) {
        assignValue(result, key, baseClone(subValue, isDeep, customizer, key, value, stack));
      });
      return isArr ? result : copySymbols(value, result);
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     */
    function baseConforms (source) {
      var props = keys(source),
          length = props.length;

      return function (object) {
        if (object == null) {
          return !length;
        }
        var index = length;
        while (index--) {
          var key       = props[index],
              predicate = source[key],
              value     = object[key];

          if ((value === undefined && !(key in Object(object))) || !predicate(value)) {
            return false;
          }
        }
        return true;
      };
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} 返回新对象
     */
    var baseCreate = (function () {
      function object () {
      }

      return function (prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result       = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an array
     * of `func` arguments.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay (func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function () {
        func.apply(undefined, args);
      }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support for
     * excluding multiple arrays or callback shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference (array, values, iteratee, comparator) {
      var index        = -1,
          includes     = arrayIncludes,
          isCommon     = true,
          length       = array.length,
          result       = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values   = new SetCache(values);
      }
      outer:
        while (++index < length) {
          var value    = array[index],
              computed = iteratee ? iteratee(value) : value;

          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          }
          else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} predicate 这个函数会处理每一个元素
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`
     */
    function baseEvery (collection, predicate) {
      var result = true;
      baseEach(collection, function (value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill (array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} predicate 这个函数会处理每一个元素
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter (collection, predicate) {
      var result = [];
      baseEach(collection, function (value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @param {Object} [stack] Tracks traversed arrays.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten (array, isDeep, isStrict, result, stack) {
      result || (result = []);

      var index  = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isArrayLikeObject(value) &&
          (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            stack || (stack = new Stack);
            if (stack.get(array)) {
              return result;
            }
            stack.set(array, true);

            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result, stack);

            stack['delete'](array);
          }
          else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} 返回对象
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} 返回对象
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback shorthands.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     */
    function baseForIn (object, iteratee) {
      return object == null ? object : baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback shorthands.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     */
    function baseForOwn (object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback shorthands.
     *
     * @private
     * @param {Object} object 要遍历的对象
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     */
    function baseForOwnRight (object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions (object, props) {
      return arrayFilter(props, function (key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet (object, path) {
      path = isKey(path, object) ? [path + ''] : baseToPath(path);

      var index  = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists否则返回 `false`
     */
    function baseHas (object, key) {
      // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
      // that are composed entirely of index properties, return `false` for
      // `hasOwnProperty` checks of them.
      return hasOwnProperty.call(object, key) ||
        (typeof object == 'object' && key in object && getPrototypeOf(object) === null);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists否则返回 `false`
     */
    function baseHasIn (object, key) {
      return key in Object(object);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for callback shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection (arrays, iteratee, comparator) {
      var includes  = comparator ? arrayIncludesWith : arrayIncludes,
          othLength = arrays.length,
          othIndex  = othLength,
          caches    = Array(othLength),
          result    = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        caches[othIndex] = !comparator && (iteratee || array.length >= 120)
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index  = -1,
          length = array.length,
          seen   = caches[0];

      outer:
        while (++index < length) {
          var value    = array[index],
              computed = iteratee ? iteratee(value) : value;

          if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
            var othIndex = othLength;
            while (--othIndex) {
              var cache = caches[othIndex];
              if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
                continue outer;
              }
            }
            if (seen) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke (object, path, args) {
      if (!isKey(path, object)) {
        path   = baseToPath(path);
        object = parent(object, path);
        path   = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {boolean} [bitmask] The bitmask of comparison flags.
     *  The bitmask may be composed of the following flags:
     *     1 - Unordered comparison
     *     2 - Partial comparison
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent否则返回 `false`
     */
    function baseIsEqual (value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` 了解详情
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent否则返回 `false`
     */
    function baseIsEqualDeep (object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag   = arrayTag,
          othTag   = arrayTag;

      if (!objIsArr) {
        objTag = getTag(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = getTag(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj  = objTag == objectTag && !isHostObject(object),
          othIsObj  = othTag == objectTag && !isHostObject(other),
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag, equalFunc, customizer, bitmask);
      }
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      if (!isPartial) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, bitmask, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stack || (stack = new Stack);
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      stack.set(object, other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, bitmask, stack);

      stack['delete'](object);
      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback shorthands.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match否则返回 `false`
     */
    function baseIsMatch (object, source, matchData, customizer) {
      var index        = matchData.length,
          length       = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
        ) {
          return false;
        }
      }
      while (++index < length) {
        data         = matchData[index];
        var key      = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack  = new Stack,
              result = customizer ? customizer(objValue, srcValue, key, object, source, stack) : undefined;

          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee (value) {
      var type = typeof value;
      if (type == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (type == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @type Function
     * @param {Object} object 要检索的对象
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys (object) {
      return nativeKeys(Object(object));
    }

    /**
     * The base implementation of `_.keysIn` which doesn't skip the constructor
     * property of prototypes or treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn (object) {
      object = object == null ? object : Object(object);

      var result = [];
      for (var key in object) {
        result.push(key);
      }
      return result;
    }

    // Fallback for IE < 9 with es6-shim.
    if (enumerate && !propertyIsEnumerable.call({'valueOf': 1}, 'valueOf')) {
      baseKeysIn = function (object) {
        return iteratorToArray(enumerate(object));
      };
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap (collection, iteratee) {
      var index  = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function (value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches (source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key   = matchData[0][0],
            value = matchData[0][1];

        return function (object) {
          if (object == null) {
            return false;
          }
          return object[key] === value &&
            (value !== undefined || (key in Object(object)));
        };
      }
      return function (object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty (path, srcValue) {
      return function (object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object 目标对象
     * @param {Object} source 来源对象
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMerge (object, source, customizer, stack) {
      if (object === source) {
        return;
      }
      var props = (isArray(source) || isTypedArray(source)) ? undefined : keysIn(source);
      arrayEach(props || source, function (srcValue, key) {
        if (props) {
          key      = srcValue;
          srcValue = source[key];
        }
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer ? customizer(object[key], srcValue, (key + ''), object, source, stack) : undefined;
          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      });
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object 目标对象
     * @param {Object} source 来源对象
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     */
    function baseMergeDeep (object, source, key, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked  = stack.get(srcValue) || stack.get(objValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, (key + ''), object, source, stack) : undefined,
          isCommon = newValue === undefined;

      if (isCommon) {
        newValue = srcValue;
        if (isArray(srcValue) || isTypedArray(srcValue)) {
          newValue = isArray(objValue)
            ? objValue
            : ((isArrayLikeObject(objValue)) ? copyArray(objValue) : baseClone(srcValue));
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = isArguments(objValue)
            ? toPlainObject(objValue)
            : (isObject(objValue) ? objValue : baseClone(srcValue));
        }
        else {
          isCommon = isFunction(srcValue);
        }
      }
      stack.set(srcValue, newValue);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        mergeFunc(newValue, srcValue, customizer, stack);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy (collection, iteratees, orders) {
      var index      = -1,
          toIteratee = getIteratee();

      iteratees = arrayMap(iteratees.length ? iteratees : Array(1), function (iteratee) {
        return toIteratee(iteratee);
      });

      var result = baseMap(collection, function (value, key, collection) {
        var criteria = arrayMap(iteratees, function (iteratee) {
          return iteratee(value);
        });
        return {'criteria': criteria, 'index': ++index, 'value': value};
      });

      return baseSortBy(result, function (object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property names.
     *
     * @private
     * @param {Object} object 来源对象
     * @param {string[]} props The property names to pick.
     * @returns {Object} 返回新对象
     */
    function basePick (object, props) {
      object = Object(object);
      return arrayReduce(props, function (result, key) {
        if (key in object) {
          result[key] = object[key];
        }
        return result;
      }, {});
    }

    /**
     * The base implementation of  `_.pickBy` without support for callback shorthands.
     *
     * @private
     * @param {Object} object 来源对象
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} 返回新对象
     */
    function basePickBy (object, predicate) {
      var result = {};
      baseForIn(object, function (value, key) {
        if (predicate(value)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty (key) {
      return function (object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep (path) {
      return function (object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAll`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAll (array, values) {
      return basePullAllBy(array, values);
    }

    /**
     * The base implementation of `_.pullAllBy` without support for callback
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @returns {Array} Returns `array`.
     */
    function basePullAllBy (array, values, iteratee) {
      var index  = -1,
          length = values.length,
          seen   = array;

      if (iteratee) {
        seen = arrayMap(array, function (value) {
          return iteratee(value);
        });
      }
      while (++index < length) {
        var fromIndex = 0,
            value     = values[index],
            computed  = iteratee ? iteratee(value) : value;

        while ((fromIndex = baseIndexOf(seen, computed, fromIndex)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt (array, indexes) {
      var length    = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (lastIndex == length || index != previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          }
          else if (!isKey(index, array)) {
            var path   = baseToPath(index),
                object = parent(array, path);

            if (object != null) {
              delete object[last(path)];
            }
          }
          else {
            delete array[index];
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom (min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight`.
     *
     * @private
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the new array of numbers.
     */
    function baseRange (start, end, step, fromRight) {
      start = toNumber(start);
      start = start === start ? start : 0;

      if (end === undefined) {
        end   = start;
        start = 0;
      } else {
        end = toNumber(end) || 0;
      }
      step = step === undefined ? (start < end ? 1 : -1) : (toNumber(step) || 0);

      var index  = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要设置的对象路径
     * @param {*} value 要设置的值
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} 返回对象
     */
    function baseSet (object, path, value, customizer) {
      path = isKey(path, object) ? [path + ''] : baseToPath(path);

      var index     = -1,
          length    = path.length,
          lastIndex = length - 1,
          nested    = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          var newValue = value;
          if (index != lastIndex) {
            var objValue = nested[key];
            newValue     = customizer ? customizer(objValue, key, nested) : undefined;
            if (newValue === undefined) {
              newValue = objValue == null ? (isIndex(path[index + 1]) ? [] : {}) : objValue;
            }
          }
          assignValue(nested, key, newValue);
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function (func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice (array, start, end) {
      var index  = -1,
          length = array.length;

      start = start == null ? 0 : toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands.
     *
     * @private
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} predicate 这个函数会处理每一个元素
     * @returns {boolean} Returns `true` if any element passes the predicate check否则返回 `false`
     */
    function baseSome (collection, predicate) {
      var result;

      baseEach(collection, function (value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex (array, value, retHighest) {
      var low  = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid      = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee 这个函数会处理每一个元素
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted into `array`.
     */
    function baseSortedIndexBy (array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low        = 0,
          high       = array ? array.length : 0,
          valIsNaN   = value !== value,
          valIsNull  = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid         = nativeFloor((low + high) / 2),
            computed    = iteratee(array[mid]),
            isDef       = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq (array) {
      return baseSortedUniqBy(array);
    }

    /**
     * The base implementation of `_.sortedUniqBy` without support for callback
     * shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniqBy (array, iteratee) {
      var index    = 0,
          length   = array.length,
          value    = array[0],
          computed = iteratee ? iteratee(value) : value,
          seen     = computed,
          resIndex = 0,
          result   = [value];

      while (++index < length) {
        value = array[index],
          computed = iteratee ? iteratee(value) : value;

        if (!eq(computed, seen)) {
          seen               = computed;
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toPath` which only converts `value` to a
     * path if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function baseToPath (value) {
      return isArray(value) ? value : stringToPath(value);
    }

    /**
     * The base implementation of `_.uniqBy` without support for callback shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq (array, iteratee, comparator) {
      var index    = -1,
          includes = arrayIncludes,
          length   = array.length,
          isCommon = true,
          result   = [],
          seen     = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen     = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value    = array[index],
              computed = iteratee ? iteratee(value) : value;

          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          }
          else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object 要修改的对象
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted否则返回 `false`
     */
    function baseUnset (object, path) {
      path    = isKey(path, object) ? [path + ''] : baseToPath(path);
      object  = parent(object, path);
      var key = last(path);
      return (object != null && has(object, key)) ? delete object[key] : true;
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for callback shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate 这个函数会处理每一个元素
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile (array, predicate, isDrop, fromRight) {
      var length = array.length,
          index  = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
      predicate(array[index], index, array)) {
      }

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue (value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function (result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * callback shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} Returns the new array of values.
     */
    function baseXor (arrays, iteratee, comparator) {
      var index  = -1,
          length = arrays.length;

      while (++index < length) {
        var result = result
          ? arrayPush(
          baseDifference(result, arrays[index], iteratee, comparator),
          baseDifference(arrays[index], result, iteratee, comparator)
        )
          : arrays[index];
      }
      return (result && result.length) ? baseUniq(result, iteratee, comparator) : [];
    }

    /**
     * Creates a clone of `buffer`.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneBuffer (buffer) {
      var Ctor   = buffer.constructor,
          result = new Ctor(buffer.byteLength),
          view   = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap (map) {
      var Ctor = map.constructor;
      return arrayReduce(mapToArray(map), addMapEntry, new Ctor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp (regexp) {
      var Ctor   = regexp.constructor,
          result = new Ctor(regexp.source, reFlags.exec(regexp));

      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet (set) {
      var Ctor = set.constructor;
      return arrayReduce(setToArray(set), addSetEntry, new Ctor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol (symbol) {
      return Object(symbolValueOf.call(symbol));
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray (typedArray, isDeep) {
      var buffer = typedArray.buffer,
          Ctor   = typedArray.constructor;

      return new Ctor(isDeep ? cloneBuffer(buffer) : buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs (args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex     = -1,
          argsLength    = nativeMax(args.length - holdersLength, 0),
          leftIndex     = -1,
          leftLength    = partials.length,
          result        = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight (args, partials, holders) {
      var holdersIndex  = -1,
          holdersLength = holders.length,
          argsIndex     = -1,
          argsLength    = nativeMax(args.length - holdersLength, 0),
          rightIndex    = -1,
          rightLength   = partials.length,
          result        = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray (source, array) {
      var index  = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} 返回对象
     */
    function copyObject (source, props, object) {
      return copyObjectWith(source, props, object);
    }

    /**
     * This function is like `copyObject` except that it accepts a function to
     * customize copied values.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} 返回对象
     */
    function copyObjectWith (source, props, object, customizer) {
      object || (object = {});

      var index  = -1,
          length = props.length;

      while (++index < length) {
        var key      = props[index],
            newValue = customizer ? customizer(object[key], source[key], key, object, source) : source[key];

        assignValue(object, key, newValue);
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} 返回对象
     */
    function copySymbols (source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator (setter, initializer) {
      return function (collection, iteratee) {
        var result = initializer ? initializer() : {};
        iteratee   = getIteratee(iteratee);

        if (isArray(collection)) {
          var index  = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value), collection);
          }
        } else {
          baseEach(collection, function (value, key, collection) {
            setter(result, value, iteratee(value), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner (assigner) {
      return rest(function (object, sources) {
        var index      = -1,
            length     = object == null ? 0 : sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard      = length > 2 ? sources[2] : undefined;

        customizer = typeof customizer == 'function' ? (length--, customizer) : undefined;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length     = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach (eachFunc, fromRight) {
      return function (collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length   = collection.length,
            index    = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor (fromRight) {
      return function (object, iteratee, keysFunc) {
        var index    = -1,
            iterable = Object(object),
            props    = keysFunc(object),
            length   = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` 了解详情
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBaseWrapper (func, bitmask, thisArg) {
      var isBind = bitmask & BIND_FLAG,
          Ctor   = createCtorWrapper(func);

      function wrapper () {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }

      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new function.
     */
    function createCaseFirst (methodName) {
      return function (string) {
        string = toString(string);

        var strSymbols = reHasComplexSymbol.test(string) ? stringToArray(string) : undefined,
            chr        = strSymbols ? strSymbols[0] : string.charAt(0),
            trailing   = strSymbols ? strSymbols.slice(1).join('') : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder (callback) {
      return function (string) {
        return arrayReduce(words(deburr(string)), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper (Ctor) {
      return function () {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // 了解详情
        var args = arguments;
        switch (args.length) {
          case 0:
            return new Ctor;
          case 1:
            return new Ctor(args[0]);
          case 2:
            return new Ctor(args[0], args[1]);
          case 3:
            return new Ctor(args[0], args[1], args[2]);
          case 4:
            return new Ctor(args[0], args[1], args[2], args[3]);
          case 5:
            return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6:
            return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7:
            return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result      = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 了解详情
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` 了解详情
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurryWrapper (func, bitmask, arity) {
      var Ctor = createCtorWrapper(func);

      function wrapper () {
        var length      = arguments.length,
            index       = length,
            args        = Array(length),
            fn          = (this && this !== root && this instanceof wrapper) ? Ctor : func,
            placeholder = wrapper.placeholder;

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        return length < arity
          ? createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, undefined, args, holders, undefined, undefined, arity - length)
          : apply(fn, this, args);
      }

      return wrapper;
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow (fromRight) {
      return rest(function (funcs) {
        funcs = baseFlatten(funcs);

        var length = funcs.length,
            index  = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data     = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function () {
          var args  = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index  = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` 了解详情
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper (func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry        = bitmask & ARY_FLAG,
          isBind       = bitmask & BIND_FLAG,
          isBindKey    = bitmask & BIND_KEY_FLAG,
          isCurry      = bitmask & CURRY_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          isFlip       = bitmask & FLIP_FLAG,
          Ctor         = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper () {
        var length = arguments.length,
            index  = length,
            args   = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            return createRecurryWrapper(func, bitmask, createHybridWrapper, placeholder, thisArg, args, argsHolders, argPos, ary, arity - length);
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn          = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && args.length > 1) {
          args.reverse();
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(fn);
        }
        return fn.apply(thisBinding, args);
      }

      return wrapper;
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new invoker function.
     */
    function createOver (arrayFunc) {
      return rest(function (iteratees) {
        iteratees = arrayMap(baseFlatten(iteratees), getIteratee());
        return rest(function (args) {
          var thisArg = this;
          return arrayFunc(iteratees, function (iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] 填充的长度
     * @param {string} [chars=' '] 填充字符
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding (string, length, chars) {
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return '';
      }
      var padLength = length - strLength;
      chars         = chars === undefined ? ' ' : (chars + '');

      var result = repeat(chars, nativeCeil(padLength / stringSize(chars)));
      return reHasComplexSymbol.test(chars)
        ? stringToArray(result).slice(0, padLength).join('')
        : result.slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` 了解详情
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartialWrapper (func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor   = createCtorWrapper(func);

      function wrapper () {
        var argsIndex  = -1,
            argsLength = arguments.length,
            leftIndex  = -1,
            leftLength = partials.length,
            args       = Array(leftLength + argsLength),
            fn         = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }

      return wrapper;
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask of wrapper flags. See `createWrapper` 了解详情
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder to replace.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurryWrapper (func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry          = bitmask & CURRY_FLAG,
          newArgPos        = argPos ? copyArray(argPos) : undefined,
          newsHolders      = isCurry ? holders : undefined,
          newHoldersRight  = isCurry ? undefined : holders,
          newPartials      = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

      if (!(bitmask & CURRY_BOUND_FLAG)) {
        bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
      }
      var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, arity],
          result  = wrapFunc.apply(undefined, newData);

      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return result;
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound (methodName) {
      var func = Math[methodName];
      return function (number, precision) {
        number    = toNumber(number);
        precision = toInteger(precision);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) 了解详情
          var pair  = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && new Set([1, 2]).size === 2) ? noop : function (values) {
      return new Set(values);
    };

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask of wrapper flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper (func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary   = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight  = holders;

        partials = holders = undefined;
      }
      var data    = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
      }
      func     = newData[0];
      bitmask  = newData[1];
      thisArg  = newData[2];
      partials = newData[3];
      holders  = newData[4];
      arity    = newData[9] = newData[9] == null
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
        bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == BIND_FLAG) {
        var result = createBaseWrapper(func, bitmask, thisArg);
      } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
        result = createCurryWrapper(func, bitmask, arity);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
        result = createPartialWrapper(func, bitmask, thisArg, partials);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` 了解详情
     * @param {Object} [stack] Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent否则返回 `false`
     */
    function equalArrays (array, other, equalFunc, customizer, bitmask, stack) {
      var index       = -1,
          isPartial   = bitmask & PARTIAL_COMPARE_FLAG,
          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
          arrLength   = array.length,
          othLength   = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var result = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isUnordered) {
          if (!arraySome(other, function (othValue) {
              return arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack);
            })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **注意:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` 了解详情
     * @returns {boolean} Returns `true` if the objects are equivalent否则返回 `false`
     */
    function equalByTag (object, other, tag, equalFunc, customizer, bitmask) {
      switch (tag) {
        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object) ? other != +other : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 了解详情
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
          convert || (convert = setToArray);

          // Recursively compare objects (susceptible to call stack limits).
          return (isPartial || object.size == other.size) &&
            equalFunc(convert(object), convert(other), customizer, bitmask | UNORDERED_COMPARE_FLAG);

        case symbolTag:
          return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual` 了解详情
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent否则返回 `false`
     */
    function equalObjects (object, other, equalFunc, customizer, bitmask, stack) {
      var isPartial   = bitmask & PARTIAL_COMPARE_FLAG,
          isUnordered = bitmask & UNORDERED_COMPARE_FLAG,
          objProps    = keys(object),
          objLength   = objProps.length,
          othProps    = keys(other),
          othLength   = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : baseHas(other, key)) || !(isUnordered || key == othProps[index])) {
          return false;
        }
      }
      var skipCtor = isPartial;
      while (++index < objLength) {
        key          = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var result = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
              : result
          )) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) && !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function (func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName (func) {
      var result = (func.name + ''),
          array  = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data      = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "iteratee" function. If the `_.iteratee` method is
     * customized this function returns the custom method, otherwise it returns
     * `baseIteratee`. If arguments are provided the chosen function is invoked
     * with them and its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee () {
      var result = lodash.iteratee || iteratee;
      result     = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **注意:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData (object) {
      var result = toPairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative (object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Creates an array of the own symbol properties of `object`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = getOwnPropertySymbols || function () {
        return [];
      };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function getTag (value) {
      return objectToString.call(value);
    }

    // Fallback for IE 11 providing `toStringTag` values for maps and sets.
    if ((Map && getTag(new Map) != mapTag) || (Set && getTag(new Set) != setTag)) {
      getTag = function (value) {
        var result     = objectToString.call(value),
            Ctor       = result == objectTag ? value.constructor : null,
            ctorString = typeof Ctor == 'function' ? funcToString.call(Ctor) : '';

        if (ctorString) {
          if (ctorString == mapCtorString) {
            return mapTag;
          }
          if (ctorString == setCtorString) {
            return setTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView (start, end, transforms) {
      var index  = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':
            start += size;
            break;
          case 'dropRight':
            end -= size;
            break;
          case 'take':
            end = nativeMin(end, start + size);
            break;
          case 'takeRight':
            start = nativeMax(start, end - size);
            break;
        }
      }
      return {'start': start, 'end': end};
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists否则返回 `false`
     */
    function hasPath (object, path, hasFunc) {
      if (object == null) {
        return false;
      }
      var result = hasFunc(object, path);
      if (!result && !isKey(path)) {
        path   = baseToPath(path);
        object = parent(object, path);
        if (object != null) {
          path   = last(path);
          result = hasFunc(object, path);
        }
      }
      return result || (isLength(object && object.length) && isIndex(path, object.length) &&
        (isArray(object) || isString(object) || isArguments(object)));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray (array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject (object) {
      var Ctor = object.constructor;
      return baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **注意:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag (object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Creates an array of index keys for `object` values of arrays,
     * `arguments` objects, and strings, otherwise `null` is returned.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @returns {Array|null} Returns index keys, else `null`.
     */
    function indexKeys (object) {
      var length = object ? object.length : undefined;
      return (isLength(length) && (isArray(object) || isString(object) || isArguments(object)))
        ? baseTimes(length, String)
        : null;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call否则返回 `false`
     */
    function isIterateeCall (value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * 检查 `value` 是否是 a property name and not a property path.
     *
     * @private
     * @param {*} value 要检查的值
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name否则返回 `false`
     */
    function isKey (value, object) {
      if (typeof value == 'number') {
        return true;
      }
      return !isArray(value) &&
        (reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object)));
    }

    /**
     * 检查 `value` 是否是 suitable for use as unique object key.
     *
     * @private
     * @param {*} value 要检查的值
     * @returns {boolean} Returns `true` if `value` is suitable否则返回 `false`
     */
    function isKeyable (value) {
      var type = typeof value;
      return type == 'number' || type == 'boolean' ||
        (type == 'string' && value !== '__proto__') || value == null;
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart否则返回 `false`
     */
    function isLaziable (func) {
      var funcName = getFuncName(func),
          other    = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * 检查 `value` 是否是 likely a prototype object.
     *
     * @private
     * @param {*} value 要检查的值
     * @returns {boolean} Returns `true` if `value` is a prototype否则返回 `false`
     */
    function isPrototype (value) {
      var Ctor  = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * 检查 `value` 是否是 suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value 要检查的值
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons否则返回 `false`
     */
    function isStrictComparable (value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * modify function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * combined case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData (data, source) {
      var bitmask    = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon   = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

      var isCombo =
            (srcBitmask == ARY_FLAG && (bitmask == CURRY_FLAG)) ||
            (srcBitmask == ARY_FLAG && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
            (srcBitmask == (ARY_FLAG | REARG_FLAG) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3]      = partials ? composeArgs(partials, value, source[4]) : copyArray(value);
        data[4]      = partials ? replaceHolders(data[3], PLACEHOLDER) : copyArray(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5]  = partials ? composeArgsRight(partials, value, source[6]) : copyArray(value);
        data[6]  = partials ? replaceHolders(data[5], PLACEHOLDER) : copyArray(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = copyArray(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged counterparts.
     * @returns {*} Returns the value to assign.
     */
    function mergeDefaults (objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, mergeDefaults, stack);
      }
      return objValue === undefined ? baseClone(srcValue) : objValue;
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object 要检索的对象
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent (object, path) {
      return path.length == 1 ? object : get(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder (array, indexes) {
      var arrLength = array.length,
          length    = nativeMin(indexes.length, arrLength),
          oldArray  = copyArray(array);

      while (length--) {
        var index     = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **注意:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * 了解详情
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function () {
      var count      = 0,
          lastCalled = 0;

      return function (key, value) {
        var stamp     = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string 要转换的字符串
     * @returns {Array} Returns the property path array.
     */
    function stringToPath (string) {
      var result = [];
      toString(string).replace(rePropName, function (match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the array-like object.
     */
    function toArrayLikeObject (value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Converts `value` to a function if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Function} Returns the function.
     */
    function toFunction (value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone (wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result         = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__   = wrapper.__index__;
      result.__values__  = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * 将数组拆分成多个 size 长度的块，并组成一个新数组。
     * 如果数组无法被分割成全部等长的块，那么最后剩余的元素将组成一个块。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要被处理的数组
     * @param {number} [size=0] 每个块的长度
     * @returns {Array} 返回一个拆分好的新数组
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk (array, size) {
      size = nativeMax(toInteger(size), 0);

      var length = array ? array.length : 0;
      if (!length || size < 1) {
        return [];
      }
      var index    = 0,
          resIndex = -1,
          result   = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * 创建一个移除了所有假值的数组。例如：`false`、`null`、
     * `0`、`""`、`undefined`， 以及`NaN` 都是 “假值”.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要被处理的数组。
     * @returns {Array} 返回移除了假值的数组。
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact (array) {
      var index    = -1,
          length   = array ? array.length : 0,
          resIndex = -1,
          result   = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * 创建一个用任何数组 或 值连接的新数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要被连接的数组
     * @param {...*} [values] 需要被连接的值的队列 
     * @returns {Array} 返回连接后的新数组
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var concat = rest(function (array, values) {
      values = baseFlatten(values);
      return arrayConcat(isArray(array) ? array : [Object(array)], values);
    });

    /**
     * 创建一个差异化后的数组，不包括使用 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 方法提供的数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {...Array} [values] 用于对比差异的数组
     * @returns {Array} 返回一个差异化后的新数组
     * @example
     *
     * _.difference([3, 2, 1], [4, 2]);
     * // => [3, 1]
     */
    var difference = rest(function (array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * 这个方法类似 `_.difference`，除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {...Array} [values] 用于对比差异的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回一个差异化后的新数组
     * @example
     *
     * _.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
     * // => [3.1, 1.3]
     *
     * // 使用了 `_.property` 的回调结果
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = rest(function (array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, false, true), getIteratee(iteratee))
        : [];
    });

    /**
     * 这个方法类似 `_.difference`，除了它接受一个 comparator 调用每一个数组元素的值。 comparator 会传入2个参数：(arrVal, othVal)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {...Array} [values] 用于对比差异的数组
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} 返回一个差异化后的新数组
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = rest(function (array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, false, true), undefined, comparator)
        : [];
    });

    /**
     * 裁剪数组中的前 N 个数组，返回剩余的部分。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {number} [n=1] 裁剪的个数
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} 返回数组的剩余的部分。
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop (array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : n;
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * 从右边开始裁剪数组中的 N 个数组，返回剩余的部分。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {number} [n=1] 裁剪的个数
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} 返回数组的剩余的部分。
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight (array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * 从右边开始裁剪数组，起点从 `predicate` 返回假值开始。`predicate` 会传入3个参数：(value, index, array)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会在每一次迭代调用
     * @returns {Array} 返回裁剪后的数组
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * resolve( _.dropRightWhile(users, function(o) { return !o.active; }) );
     * // => ['barney']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.dropRightWhile(users, { 'user': 'pebbles', 'active': false }) );
     * // => ['barney', 'fred']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.dropRightWhile(users, ['active', false]) );
     * // => ['barney']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.dropRightWhile(users, 'active') );
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile (array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * 裁剪数组，起点从 `predicate` 返回假值开始。`predicate` 会传入3个参数：(value, index, array)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array array 需要处理的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会在每一次迭代调用
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * resolve( _.dropWhile(users, function(o) { return !o.active; }) );
     * // => ['pebbles']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.dropWhile(users, { 'user': 'barney', 'active': false }) );
     * // => ['fred', 'pebbles']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.dropWhile(users, ['active', false]) );
     * // => ['pebbles']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.dropWhile(users, 'active') );
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile (array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * 指定 `值` 填充数组，从 `start` 到 `end` 的位置，但不包括 `end` 本身的位置。
     *
     * **注意:** 这个方法会改变数组
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要填充的数组
     * @param {*} value 填充的值
     * @param {number} [start=0] 开始位置
     * @param {number} [end=array.length] 结束位置
     * @returns {Array} 返回数组
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill (array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end   = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * 这个方法类似 `_.find`。除了它返回最先通过 `predicate` 判断为真值的元素的 index ，而不是元素本身。
     * 
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要搜索的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会在每一次迭代调用
     * @returns {number} 返回符合元素的 index，否则返回 `-1`。
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // 使用了 `_.matches` 的回调结果
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // 使用了 `_.property` 的回调结果
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex (array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3))
        : -1;
    }

    /**
     * 这个方式类似 `_.findIndex` ， 不过它是从右到左的。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要搜索的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会在每一次迭代调用
     * @returns {number} 返回符合元素的 index，否则返回 `-1`。
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // 使用了 `_.matches` 的回调结果
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // 使用了 `_.property` 的回调结果
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex (array, predicate) {
      return (array && array.length)
        ? baseFindIndex(array, getIteratee(predicate, 3), true)
        : -1;
    }

    /**
     * 创建一个扁平化的数组，每一个值会传入 `iteratee` 处理，处理结果会与值合并。
     * iteratee 会传入3个参数：(value, index|key, array)。
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 遍历用的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会在每一次迭代调用
     * @returns {Array} 返回新数组
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap (array, iteratee) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(arrayMap(array, getIteratee(iteratee, 3))) : [];
    }

    /**
     * 向上一级展平数组嵌套
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要展平的数组
     * @returns {Array} 返回一个展平后的数组
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     */
    function flatten (array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array) : [];
    }

    /**
     * 这个方法类似 `_.flatten`， 但它会递归展平数组。
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要展平的数组
     * @returns {Array} 返回一个展平后的数组
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep (array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * 反向版 `_.toPairs`，这个方法返回一个由键值对构成的对象。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} pairs 键值对
     * @returns {Object} 返回一个新对象
     * @example
     *
     * _.fromPairs([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function fromPairs (pairs) {
      var index  = -1,
          length = pairs ? pairs.length : 0,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        baseSet(result, pair[0], pair[1]);
      }
      return result;
    }

    /**
     * 获得数组的首个元素
     *
     * @static
     * @memberOf _
     * @alias first
     * @category Array
     * @param {Array} array 要检索的数组
     * @returns {*} 返回数组中的首个元素
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head (array) {
      return array ? array[0] : undefined;
    }

    /**
     * 根据 value 使用 SameValueZero 等值比较返回数组中首次匹配的 index， 如果 fromIndex 为负值，将从数组尾端索引进行匹配，如果将 fromIndex 设置为 true，将使用更快的二进制检索机制。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要检索的数组
     * @param {*} value 要检索的值
     * @param {number} [fromIndex=0] 需要检索的起始位置，如果为 true 将使用二进制检索方式。
     * @returns {number} 返回匹配值的index，否则返回 -1。
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // 使用了 `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf (array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      fromIndex = toInteger(fromIndex);
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * 获取数组中除了最后一个元素之外的所有元素
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} 需要检索的数组
     * @returns {Array} 返回没有最后一个元素的数组
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial (array) {
      return dropRight(array, 1);
    }

    /**
     * 创建一个包含所有使用 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 进行等值比较后筛选的唯一值数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要处理的数组队列
     * @returns {Array} 返回数组中所有数组共享元素的新数组
     * @example
     * _.intersection([2, 1], [4, 2], [1, 2]);
     * // => [2]
     */
    var intersection = rest(function (arrays) {
      var mapped = arrayMap(arrays, toArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * 这个方法类似 `_.intersection`，除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要检索的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回数组中共享元素的新数组
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1]
     *
     * // 使用了 `_.property` 的回调结果
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = rest(function (arrays) {
      var iteratee = last(arrays),
          mapped   = arrayMap(arrays, toArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee))
        : [];
    });

    /**
     * 这个方法类似 `_.intersection`，除了它接受一个 comparator 调用每一个数组和值。iteratee 会传入2个参数：((arrVal, othVal)
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要检索的数组
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} 返回数组中共享元素的新数组
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = rest(function (arrays) {
      var comparator = last(arrays),
          mapped     = arrayMap(arrays, toArrayLikeObject);

      if (comparator === last(mapped)) {
        comparator = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * 将数组中的所有元素转换为由 `separator` 分隔的字符串。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要转换的数组
     * @param {string} [separator=','] 分隔符
     * @returns {string} 返回连接好的字符串
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join (array, separator) {
      return array ? nativeJoin.call(array, separator) : '';
    }

    /**
     * 获取数组中的最后一个元素
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要检索的数组
     * @returns {*} 返回数组中的最后一个元素
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last (array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * 这个方法类似  `_.indexOf`，除了它是从右到左遍历元素的。
     * 这个方法类似 `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的数组
     * @param {*} value 要检索的值
     * @param {number} [fromIndex=array.length-1] 检索 index 的起点
     * 
     * @returns {number} 返回匹配元素的 index，否则返回 -1
     * 
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // 使用了 `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf (array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = (index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1)) + 1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * 移除所有经过 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 等值比较为 true 的元素
     *
     * **注意:** 不同于 `_.without`，这个方法会改变数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要调整的数组
     * @param {...*} [values] 要移除的值
     * @returns {Array} 返回数组本身
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    var pull = rest(pullAll);

    /**
     * 这个方式类似 `_.pull`，除了它接受数组形式的一系列值。
     *
     * **注意:** 不同于 `_.difference`，这个方法会改变数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要调整的数组
     * @param {Array} values 要移除的值
     * @returns {Array} 返回数组本身
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, [2, 3]);
     * console.log(array);
     * // => [1, 1]
     */
    function pullAll (array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * 这个方法类似 `_.pullAll`，除了它接受一个 comparator 调用每一个数组元素的值。 comparator 会传入一个参数：(value)。
     *
     * **注意:** 不同于 `_.differenceBy`，这个方法会改变数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要调整的数组
     * @param {Array} values 要移除的值
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回数组本身
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy (array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAllBy(array, values, getIteratee(iteratee))
        : array;
    }

    /**
     * 根据给的 `indexes` 移除对应的数组元素并返回被移除的元素。
     *
     * **注意:** 不同于 `_.at`，这个方法会改变数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要调整的数组
     * @param {...(number|number[])} [indexes] indexes 可以是特殊的数组队列，或者个别的单个或多个参数
     * 
     * @returns {Array} 返回被移除的元素数组
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = rest(function (array, indexes) {
      indexes = arrayMap(baseFlatten(indexes), String);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(compareAscending));
      return result;
    });

    /**
     * 移除经过 `predicate` 处理为真值的元素，并返回被移除的元素。predicate 会传入3个参数：(value, index, array)
     *
     * **注意:** Unlike `_.filter`，这个方法会改变数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要调整的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回被移除的元素的数组
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove (array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index   = -1,
          indexes = [],
          length  = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * 反转数组，第一个元素移动到最后一位，第二个元素移动到倒数第二，类似这样。
     *
     * **注意:** 这个方法会改变数组，根据 [`Array#reverse`](https://mdn.io/Array/reverse)
     *
     * @memberOf _
     * @category Array
     * @returns {Array} 返回原数组
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse (array) {
      return array ? nativeReverse.call(array) : array;
    }

    /**
     * 创建一个裁剪后的数组，从 start 到 end 的位置，但不包括 end 本身的位置。
     * 
     * **注意:** 这个方法用于代替 [`Array#slice`](https://mdn.io/Array/slice)
     * 来确保数组正确返回
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要裁剪的数组
     * @param {number} [start=0] 开始位置
     * @param {number} [end=array.length] 结束位置
     * @returns {Array} 返回裁剪后的数组
     */
    function slice (array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end   = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * 使用二进制的方式检索来决定 value 应该插入在数组中位置。它的 index 应该尽可能的小以保证数组的排序。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的已排序数组
     * @param {*} value 要评估位置的值
     * @returns {number} 返回 value 应该在数组中插入的 index。
     * 
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 5], 4);
     * // => 0
     */
    function sortedIndex (array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * 这个方法类似 `_.sortedIndex`，除了它接受一个 iteratee 调用每一个数组和值来计算排序。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的已排序数组
     * @param {*} value 要评估位置的值
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {number} 返回 value 应该在数组中插入的 index。
     * @example
     *
     * var dict = { 'thirty': 30, 'forty': 40, 'fifty': 50 };
     *
     * _.sortedIndexBy(['thirty', 'fifty'], 'forty', _.propertyOf(dict));
     * // => 1
     *
     * // 使用了 `_.property` 回调结果
     * _.sortedIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy (array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee));
    }

    /**
     * 这个方法类似 `_.indexOf`，除了它是执行二进制来检索已经排序的数组的。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的数组
     * @param {*} value 要评估位置的值
     * @returns {number} 返回匹配值的 index ，否则返回 `-1`.
     * @example
     *
     * _.sortedIndexOf([1, 1, 2, 2], 2);
     * // => 2
     */
    function sortedIndexOf (array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * 这个方法类似 `_.sortedIndex`，除了它返回在 value 中尽可能大的 index 位置。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的已排序数组
     * @param {*} value 要评估位置的值
     * @returns {number} 返回 value 应该在数组中插入的 index。
     * @example
     *
     * _.sortedLastIndex([4, 5], 4);
     * // => 1
     */
    function sortedLastIndex (array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * 这个方法类似 `_.sortedLastIndex`，除了它接受一个 iteratee 调用每一个数组和值来计算排序。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的已排序数组
     * @param {*} value 要评估位置的值
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {number} 返回 value 应该在数组中插入的 index。
     * @example
     *
     * // 使用了 `_.property` 的回调结果
     * _.sortedLastIndexBy([{ 'x': 4 }, { 'x': 5 }], { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy (array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee), true);
    }

    /**
     * 这个方法类似 `_.lastIndexOf`，除了它是执行二进制来检索已经排序的数组的。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要检索的数组
     * @param {*} value 要评估位置的值
     * @returns {number} 返回匹配值的 index ，否则返回 -1.
     * @example
     *
     * _.sortedLastIndexOf([1, 1, 2, 2], 2);
     * // => 3
     */
    function sortedLastIndexOf (array, value) {
      var length = array ? array.length : 0;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * 这个方法类似 `_.uniq`，除了它会排序并优化数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要调整的数组
     * @returns {Array} 返回一个不重复的数组
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq (array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * 这个方法类似 `_.uniqBy`，除了它接受一个 iteratee 调用每一个数组和值来排序并优化数组。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要调整的数组
     * @param {Function} [iteratee] 这个函数会处理每一个元素
     * @returns {Array} 返回一个不重复的数组
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.2]
     */
    function sortedUniqBy (array, iteratee) {
      return (array && array.length)
        ? baseSortedUniqBy(array, getIteratee(iteratee))
        : [];
    }

    /**
     * 获取数组中除了第一个元素的剩余数组
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要检索的数组
     * @returns {Array} 返回数组中除了第一个元素的剩余数组
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail (array) {
      return drop(array, 1);
    }

    /**
     * 从数组的起始元素开始提取 N 个元素。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {number} [n=1] 要提取的个数
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} 返回提取的元素数组
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take (array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * 从数组的结束元素开始提取 N 个数组
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {number} [n=1] 要提取的个数
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} 返回提取的元素数组
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight (array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * 从数组的最右边开始提取数组，直到 `predicate` 返回假值。`predicate` 会传入三个参数：(value, index, array)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回提取的元素数组
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * resolve( _.takeRightWhile(users, function(o) { return !o.active; }) );
     * // => ['fred', 'pebbles']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.takeRightWhile(users, { 'user': 'pebbles', 'active': false }) );
     * // => ['pebbles']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.takeRightWhile(users, ['active', false]) );
     * // => ['fred', 'pebbles']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.takeRightWhile(users, 'active') );
     * // => []
     */
    function takeRightWhile (array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * 从数组的开始提取数组，直到 predicate 返回假值。predicate 会传入三个参数：(value, index, array)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回提取的元素数组
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * resolve( _.takeWhile(users, function(o) { return !o.active; }) );
     * // => ['barney', 'fred']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.takeWhile(users, { 'user': 'barney', 'active': false }) );
     * // => ['barney']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.takeWhile(users, ['active', false]) );
     * // => ['barney', 'fred']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.takeWhile(users, 'active') );
     * // => []
     */
    function takeWhile (array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * 创建顺序排列的唯一值组成的数组。所有值经过 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 等值比较。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要处理的数组队列
     * @returns {Array} 返回处理好的数组
     * @example
     *
     * _.union([2, 1], [4, 2], [1, 2]);
     * // => [2, 1, 4]
     */
    var union = rest(function (arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * 这个方法类似 `_.union`，除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要处理的数组队列
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回处理好的数组
     * @example
     *
     * _.unionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [2.1, 1.2, 4.3]
     *
     * // 使用了 `_.property` 的回调结果
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = rest(function (arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, false, true), getIteratee(iteratee));
    });

    /**
     * 这个方法类似 `_.union`，
* 除了它接受一个 comparator 调用每一个数组元素的值。 comparator 会传入2个参数：(arrVal, othVal)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 需要处理的数组队列
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} 返回处理好的数组
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = rest(function (arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseUniq(baseFlatten(arrays, false, true), undefined, comparator);
    });

    /**
     * 创建一个不重复的数组副本。使用了 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 等值比较。只有首次出现的元素才会被保留。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @returns {Array} 返回不重复的数组
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq (array) {
      return (array && array.length)
        ? baseUniq(array)
        : [];
    }

    /**
     * 这个方法类似 `_.uniq`，除了它接受一个 iteratee 调用每一个数组和值来计算唯一性。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回不重复的数组
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // 使用了 `_.property` 的回调结果
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy (array, iteratee) {
      return (array && array.length)
        ? baseUniq(array, getIteratee(iteratee))
        : [];
    }

    /**
     * 这个方法类似 `_.uniq`，除了它接受一个 `comparator` 来比较计算唯一性。 `comparator` 会传入2个参数：(arrVal, othVal)
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要处理的数组
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} 返回不重复的数组
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 },  { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith (array, comparator) {
      return (array && array.length)
        ? baseUniq(array, undefined, comparator)
        : [];
    }

    /**
     * 这个方法类似 `_.zip`，除了它接收一个打包后的数组并且还原为打包前的状态。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要解包的已打包数组
     * @returns {Array} 返回一个解包后的数组
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip (array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array      = arrayFilter(array, function (group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function (index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * 这个方法类似 `_.unzip`，除了它接受一个 iteratee 来决定如何重组解包后的数组。iteratee 会传入4个参数：(accumulator, value, index, group)。每组的第一个元素作为初始化的值
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 需要解包的已打包数组
     * @param {Function} [iteratee=_.identity] 决定如何重组解包后的元素
     * @returns {Array} 返回一个解包后的数组
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith (array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function (group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * 创建一个移除了所有提供的 values 的数组。使用了 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 等值比较。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array 要处理的数组
     * @param {...*} [values] 要排除的值
     * @returns {Array} 返回一个处理好的新数组
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = rest(function (array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * 创建一个包含了所有唯一值的数组。使用了 [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference) 等值比较。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 要处理的数组
     * @returns {Array} 包含了所有唯一值的新数组
     * @example
     *
     * _.xor([2, 1], [4, 2]);
     * // => [1, 4]
     */
    var xor = rest(function (arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * 这个方法类似 `_.xor`，除了它接受一个 iteratee 调用每一个数组和值。iteratee 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 要处理的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 包含了所有唯一值的新数组
     * @example
     *
     * _.xorBy([2.1, 1.2], [4.3, 2.4], Math.floor);
     * // => [1.2, 4.3]
     *
     * // 使用了 `_.property` 的回调结果
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = rest(function (arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee));
    });

    /**
     * 这个方法类似 `_.xor`，除了它接受一个 comparator 调用每一个数组元素的值。 comparator 会传入2个参数：(arrVal, othVal)。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 要处理的数组
     * @param {Function} [comparator] 这个函数会处理每一个元素
     * @returns {Array} 包含了所有唯一值的新数组
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = rest(function (arrays) {
      var comparator = last(arrays);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * 创建一个打包所有元素后的数组。第一个元素包含所有提供数组的第一个元素，第二个包含所有提供数组的第二个元素，以此类推。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 要处理的数组队列
     * @returns {Array} 返回一个打包后的数组
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = rest(unzip);

    /**
     * 这个方法类似 `_.fromPairs`，除了它接受2个数组，一个作为属性名，一个作为属性值。
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} [props=[]] 属性名
     * @param {Array} [values=[]] 属性值
     * @returns {Object} 返回一个新的对象
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject (props, values) {
      var index      = -1,
          length     = props ? props.length : 0,
          valsLength = values ? values.length : 0,
          result     = {};

      while (++index < length) {
        baseSet(result, props[index], index < valsLength ? values[index] : undefined);
      }
      return result;
    }

    /**
     * 这个方法类似 `_.zip`，除了它接受一个 iteratee 决定如何重组值。iteratee 会传入4个参数：(accumulator, value, index, group)。每组的第一个元素作为初始化的值
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] 要处理的数组队列
     * @param {Function} [iteratee=_.identity] 这个函数决定如何重组值
     * @returns {Array} 返回一个打包后的数组
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = rest(function (arrays) {
      var length   = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * 创建一个经 `lodash` 包装的对象以启用显式链模式，要解除链必须使用 `_#value` 方法。
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value 要包装的值
     * @returns {Object} 返回 `lodash` 包装的实例
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain (value) {
      var result       = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * 这个方法调用一个 `interceptor` 并返回 `value`。`interceptor` 传入一个参数：(value)
     * 目的是 `进入` 链的中间以便执行操作。
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value 提供给 `interceptor` 的值
     * @param {Function} interceptor 调用函数
     * @returns {*} 返回 `value`
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap (value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * 这个方法类似 `_.tap`， 除了它返回 `interceptor` 的返回结果
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value 提供给 `interceptor` 的值
     * @param {Function} interceptor 调用函数
     * @returns {*} 返回 `interceptor` 的返回结果
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru (value, interceptor) {
      return interceptor(value);
    }

    /**
     * 这个方法是 `_.at` 的包装版本
     *
     * @name at
     * @memberOf _
     * @category Chain
     * @param {...(string|string[])} [paths] 要选择元素的属性路径，
     * 单独指定或者数组
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     *
     * _(['a', 'b', 'c']).at(0, 2).value();
     * // => ['a', 'c']
     */
    var wrapperAt = rest(function (paths) {
      paths           = baseFlatten(paths);
      var length      = paths.length,
          start       = length ? paths[0] : 0,
          value       = this.__wrapped__,
          interceptor = function (object) {
            return baseAt(object, paths);
          };

      if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({'func': thru, 'args': [interceptor], 'thisArg': undefined});
      return new LodashWrapper(value, this.__chain__).thru(function (array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * 开启包装对象的显式链。
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // 不启用显式链
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // 启用显式链
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain () {
      return chain(this);
    }

    /**
     * 执行链式队列并返回结果
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit () {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * 这个方法是 `_.flatMap` 的包装版本。
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _([1, 2]).flatMap(duplicate).value();
     * // => [1, 1, 2, 2]
     */
    function wrapperFlatMap (iteratee) {
      return this.map(iteratee).flatten();
    }

    /**
     * 获得包装对象的下一个值，遵循 [iterator 协议](https://mdn.io/iteration_protocols#iterator)。
     * 
     *
     * @name next
     * @memberOf _
     * @category Chain
     * @returns {Object} 返回下一个 iterator 值
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext () {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done  = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return {'done': done, 'value': value};
    }

    /**
     * 启用包装对象为 iterable。
     *
     * @name Symbol.iterator
     * @memberOf _
     * @category Chain
     * @returns {Object} 返回包装对象
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator () {
      return this;
    }

    /**
     * 创建一个链式队列的拷贝，传入的值作为链式队列的值。
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @param {*} value 替换原值的值
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant (value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone        = wrapperClone(parent);
        clone.__index__  = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent       = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **注意:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} 返回 `lodash` 的包装实例
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse () {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({'func': thru, 'args': [reverse], 'thisArg': undefined});
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * 执行链式队列并提取解链后的值
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} 返回解链后的值
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue () {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * 创建一个组成对象，key是经过 `iteratee` 处理的集合的结果，value 是处理结果的次数。 `iteratee` 会传入一个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回一个组成汇总的对象
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function (result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * 通过 `predicate` 检查集合中的元素是否都返回 真值，只要 `predicate` 返回一次假值，遍历就停止，并返回 false。  
     * `predicate` 会传入3个参数：(value, index|key, collection)
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} 返回 true，如果所有元素经 predicate 检查都为真值，否则返回 false。
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // 使用了 `_.matches` 的回调结果
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.every(users, ['active', false]);
     * // => true
     *
     * // 使用了 `_.property` 的回调结果
     * _.every(users, 'active');
     * // => false
     */
    function every (collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * 遍历集合中的元素，筛选出一个经过 `predicate` 检查结果为真值的数组，predicate 会传入3个参数：(value, index|key, collection)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回筛选结果的新数组
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * resolve( _.filter(users, function(o) { return !o.active; }) );
     * // => ['fred']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.filter(users, { 'age': 36, 'active': true }) );
     * // => ['barney']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.filter(users, ['active', false]) );
     * // => ['fred']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.filter(users, 'active') );
     * // => ['barney']
     */
    function filter (collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * 遍历集合中的元素，返回最先经 `predicate` 检查为真值的元素。 predicate 会传入3个元素：(value, index|key, collection)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 要检索的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {*} 返回匹配元素，否则返回 `undefined`
     * @example
     *
     * var resolve = _.partial(_.result, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * resolve( _.find(users, function(o) { return o.age < 40; }) );
     * // => 'barney'
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.find(users, { 'age': 1, 'active': true }) );
     * // => 'pebbles'
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.find(users, ['active', false]) );
     * // => 'fred'
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.find(users, 'active') );
     * // => 'barney'
     */
    function find (collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEach);
    }

    /**
     * 这个方法类似 `_.find`，除了它是从右至左遍历集合的。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 要检索的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {*} 返回匹配元素，否则返回 `undefined`
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    function findLast (collection, predicate) {
      predicate = getIteratee(predicate, 3);
      if (isArray(collection)) {
        var index = baseFindIndex(collection, predicate, true);
        return index > -1 ? collection[index] : undefined;
      }
      return baseFind(collection, predicate, baseEachRight);
    }

    /**
     * 调用 `iteratee` 遍历集合中的元素，iteratee 会传入3个参数：(value, index|key, collection)。
     * 如果显式的返回 false ，`iteratee` 会提前退出。
     *
     * **注意:** 与其他集合方法一样，对象的 `length` 属性也会被遍历，避免这种情况，可以用 `_.forIn` 或者 `_.forOwn` 代替。
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array|Object} 返回集合
     * @example
     *
     * _([1, 2]).forEach(function(value) {
     *   console.log(value);
     * });
     * // => 输出 `1` 和 `2`
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => 输出 'a' 和 'b' (不保证遍历的顺序)
     */
    function forEach (collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEach(collection, iteratee)
        : baseEach(collection, toFunction(iteratee));
    }

    /**
     * 这个方法类似 `_.forEach`，除了它是从右到左遍历的集合中的元素的。
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array|Object} 返回集合
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => 输出 `2` 和 `1`
     */
    function forEachRight (collection, iteratee) {
      return (typeof iteratee == 'function' && isArray(collection))
        ? arrayEachRight(collection, iteratee)
        : baseEachRight(collection, toFunction(iteratee));
    }

    /**
     * 创建一个对象组成，key 是经 iteratee 处理的结果， value 是产生 key 的元素数组。 iteratee 会传入1个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回一个组成汇总的对象
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // 使用了 `_.property` 的回调结果
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function (result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * 检查 值 是否在 集合中，如果集合是字符串，那么检查 值 是否在字符串中。
     * 其他情况用 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 等值比较。
     * 如果指定 `fromIndex` 是负数，从结尾开始检索。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection 要检索的集合
     * @param {*} value 要检索的值
     * @param {number} [fromIndex=0] 要检索的 index 位置
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {boolean} 如果找到 value 返回 ture， 否则返回 false。
     * 
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes (collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex  = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * 调用 `path` 的方法处理集合中的每一个元素，返回处理的数组。
     * 如何附加的参数会传入到调用方法中。如果方法名是个函数，集合中的每个元素都会被调用到。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Array|Function|string} path 要调用的方法名 或者
     *  这个函数会处理每一个元素
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} 返回数组结果
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = rest(function (collection, path, args) {
      var index  = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function (value) {
        var func        = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * 创建一个对象组成。key 是经 `iteratee` 处理的结果，value 是产生key的元素。
     * iteratee 会传入1个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回一个组成汇总的对象
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(keyData, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function (result, value, key) {
      result[key] = value;
    });

    /**
     * 创建一个经过 `iteratee` 处理的集合中每一个元素的结果数组。
     * iteratee 会传入3个参数：(value, index|key, collection)。
     *
     * 有许多 lodash 的方法以 iteratees 的身份守护其工作，例如：
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, 以及 `_.some`
     *
     * 被守护的有:
     * `ary`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`,
     * `invert`, `parseInt`, `random`, `range`, `rangeRight`, `slice`, `some`,
     * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`,
     * 以及 `words`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回映射后的新数组
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([1, 2], square);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, square);
     * // => [3, 6] (无法保证遍历的顺序)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // 使用了 `_.property` 的回调结果
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map (collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * 这个方法类似 `_.sortBy`，除了它允许指定 iteratees 结果如何排序。
     * 如果没指定 `orders`，所有值以升序排序。
     * 其他情况，指定 "desc" 降序，指定 "asc" 升序其对应值。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function[]|Object[]|string[]} [iteratees=[_.identity]] 通过 iteratees 决定排序
     * @param {string[]} [orders] 决定 iteratees 的排序方法
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.reduce`.
     * @returns {Array} 排序排序后的新数组
     * @example
     *
     * var resolve = _.partial(_.map, _, _.values);
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // 以 `user` 升序排序 再 以 `age` 降序排序。
     * resolve( _.orderBy(users, ['user', 'age'], ['asc', 'desc']) );
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function orderBy (collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * 创建一个拆分为两部分的数组。
     * 第一部分是 `predicate` 检查为真值的，第二部分是 `predicate` 检查为假值的。
     * predicate 会传入3个参数：(value, index|key, collection)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回分组元素的数组
     * @example
     *
     * var resolve = function(result) {
     *   return _.map(result, function(array) { return _.map(array, 'user'); });
     * };
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * resolve( _.partition(users, function(o) { return o.active; }) );
     * // => [['fred'], ['barney', 'pebbles']]
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.partition(users, { 'age': 1, 'active': false }) );
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.partition(users, ['active', false]) );
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.partition(users, 'active') );
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function (result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function () {
      return [[], []];
    });

    /**
     * 通过 `iteratee` 遍历集合中的每个元素。
     * 每次返回的值会作为下一次 `iteratee` 使用。
     * 如果没有提供 `accumulator`，则集合中的第一个元素作为 `accumulator`。
     * iteratee 会传入4个参数：(accumulator, value, index|key, collection)。
     *
     * 有许多 lodash 的方法以 iteratees 的身份守护其工作，例如：
     * `_.reduce`, `_.reduceRight`, 以及 `_.transform`.
     *
     * 被守护的有:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * 以及 `sortBy`
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @param {*} [accumulator] 初始化的值
     * @returns {*} 返回累加后的值
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (无法保证遍历的顺序)
     */
    function reduce (collection, iteratee, accumulator) {
      var func               = isArray(collection) ? arrayReduce : baseReduce,
          initFromCollection = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initFromCollection, baseEach);
    }

    /**
     * 这个方法类似 `_.reduce` ，除了它是从右到左遍历的。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @param {*} [accumulator] 初始化的值
     * @returns {*} 返回累加后的值
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight (collection, iteratee, accumulator) {
      var func               = isArray(collection) ? arrayReduceRight : baseReduce,
          initFromCollection = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initFromCollection, baseEachRight);
    }

    /**
     * 反向版 `_.filter`，这个方法返回 `predicate` 检查为非真值的元素。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {Array} 返回过滤后的新数组
     * @example
     *
     * var resolve = _.partial(_.map, _, 'user');
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * resolve( _.reject(users, function(o) { return !o.active; }) );
     * // => ['fred']
     *
     * // 使用了 `_.matches` 的回调结果
     * resolve( _.reject(users, { 'age': 40, 'active': true }) );
     * // => ['barney']
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * resolve( _.reject(users, ['active', false]) );
     * // => ['fred']
     *
     * // 使用了 `_.property` 的回调结果
     * resolve( _.reject(users, 'active') );
     * // => ['barney']
     */
    function reject (collection, predicate) {
      var func  = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getIteratee(predicate, 3);
      return func(collection, function (value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * 从集合中随机获得元素
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 要取样的集合
     * @returns {*} 返回随机元素
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample (collection) {
      var array  = isArrayLike(collection) ? collection : values(collection),
          length = array.length;

      return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * 获得从集合中随机获得 `N` 个元素
     * Gets `n` random elements from `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 要取样的集合
     * @param {number} [n=0] 要取得的元素个数
     * @returns {Array} 返回随机元素
     * @example
     *
     * _.sampleSize([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sampleSize (collection, n) {
      var index     = -1,
          result    = toArray(collection),
          length    = result.length,
          lastIndex = length - 1;

      n = clamp(toInteger(n), 0, length);
      while (++index < n) {
        var rand  = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand]  = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * 创建一个被打乱元素的集合。
     * 使用了 [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle) 版本。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 要打乱的集合
     * @returns {Array} 返回一个被打乱元素的新集合
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle (collection) {
      return sampleSize(collection, MAX_ARRAY_LENGTH);
    }

    /**
     * 返回集合的长度或对象中可枚举属性的个数。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 待处理的集合
     * @returns {number} 返回集合的大小
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size (collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        var result = collection.length;
        return (result && isString(collection)) ? stringSize(collection) : result;
      }
      return keys(collection).length;
    }

    /**
     * 通过 predicate 检查集合中的元素是否存在任意真值的元素，只要 predicate 返回一次真值，遍历就停止，并返回 true。
     * predicate 会传入3个参数：(value, index|key, collection)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {boolean} 返回 true，如果任意元素经 predicate 检查都为真值，否则返回 false。
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // 使用了 `_.matches` 的回调结果
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.some(users, ['active', false]);
     * // => true
     *
     * // 使用了 `_.property` 的回调结果
     * _.some(users, 'active');
     * // => true
     */
    function some (collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * 创建一个元素数组。
     * 以 iteratee 处理的结果升序排序。
     * 这个方法执行稳定排序，也就是说相同元素会保持原始排序。
     * iteratees 会传入1个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object} collection 需要遍历的集合
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} [iteratees=[_.identity]]
     *  这个函数决定排序
     * @returns {Array} 返回排序后的数组
     * @example
     *
     * var resolve = _.partial(_.map, _, _.values);
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * resolve( _.sortBy(users, function(o) { return o.user; }) );
     * // => // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     *
     * resolve( _.sortBy(users, ['user', 'age']) );
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * resolve( _.sortBy(users, 'user', function(o) {
     *   return Math.floor(o.age / 10);
     * }) );
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortBy = rest(function (collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees.length = 1;
      }
      return baseOrderBy(collection, baseFlatten(iteratees), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * 获得 Unix 纪元(1970 1月1日 00:00:00 UTC) 直到现在的毫秒数。
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Date
     * @returns {number} 返回时间戳
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => 记录延迟函数调用的毫秒数
     */
    var now = Date.now;

    /*------------------------------------------------------------------------*/

    /**
     * 反向版 `_.before`。
     * 这个方法创建一个新函数，当调用 `N` 次或者多次之后将触发 `func` 方法。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n `func` 方法应该在调用多少次后才执行
     * @param {Function} func 指定的触发方法
     * @returns {Function} 返回限定的函数
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => 2次 `asyncSave`之后，输出 'done saving!'。
     */
    function after (n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function () {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * 创建一个最多接受 `N` 个参数，忽略多余参数的方法。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要被限制参数个数的函数
     * @param {number} [n=func.length] 限制的参数数量
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} 返回新的函数
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary (func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * 创建一个调用 `func` 的函数。
     * 调用次数不超过 `N` 次。
     * 之后再调用这个函数，将返回最后一个调用的结果。
     * 
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n 超过多少次不再调用 `func`
     * @param {Function} func 指定的触发的函数
     * @returns {Function} 返回限定的函数
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => 最多允许添加4个联系人到列表里
     */
    function before (n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function () {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * 创建一个函数 `func`，这个函数的 `this` 会被绑定在 `thisArg`。
     * 并且任何附加在 `_.bind` 的参数会被传入到这个绑定函数上。
     *
     * 这个 `_.bind.placeholder` 的值，默认是以 `_` 作为附加部分参数的占位符。
     *
     * **注意:** 不同于原生的 Function#bind，这个方法不会设置绑定函数的 length 属性。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要绑定的函数
     * @param {*} thisArg 这个 `this` 会被绑定给 `func`。
     * @param {...*} [partials] 附加的部分参数
     * @returns {Function} 返回新的绑定函数
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // 使用了占位符
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = rest(function (func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * 创建一个函数。
     * 该方法绑定 `object[key]` 的方法。
     * 任何附加在 `_.bindKey` 的参数会预设到该绑定函数上。
     *
     * 这个方法与 `_.bind` 的不同之处在于允许重写绑定函数即使它还不存在。
     * 浏览 [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * 了解更多详情。
     *
     * 这个 `_.bindKey.placeholder` 的值，默认是以 `_` 作为附加部分参数的占位符。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object 需要绑定函数的对象
     * @param {string} key 需要绑定函数对象的键
     * @param {...*} [partials] 附加的部分参数
     * @returns {Function} 返回新的绑定函数
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // 使用了占位符
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = rest(function (object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * 创建一个函数，该函数接收一个或多个 func 的参数。
     * 当该函数被调用时,如果 func 所需要传递的所有参数都被提供，则直接返回 func 所执行的结果。
     * 否则继续返回该函数并等待接收剩余的参数。
     * 可以使用 func.length 强制需要累积的参数个数。
     *
     * 这个 `_.curry.placeholder` 的值，默认是以 `_` 作为附加部分参数的占位符。
     *
     * **注意:** 这个方法不会设置 "length" 到 curried 函数上。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要 curry 的函数
     * @param {number} [arity=func.length] 需要提供给 `func` 的参数数量
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} 返回 curry 后的函数
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // 使用了占位符
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry (func, arity, guard) {
      arity              = guard ? undefined : arity;
      var result         = createWrapper(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * 这个方法类似 `_.curry`。
     * 除了它接受参数的方式用 `_.partialRight` 代替了 `_.partial`。
     *
     * 这个 `_.curry.placeholder` 的值，默认是以 `_` 作为附加部分参数的占位符。
     *
     * **注意:** 这个方法不会设置 "length" 到 curried 函数上。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要 curry 的函数
     * @param {number} [arity=func.length] 需要提供给 `func` 的参数数量
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} 返回 curry 后的函数
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // 使用了占位符
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight (func, arity, guard) {
      arity              = guard ? undefined : arity;
      var result         = createWrapper(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * 创建一个防抖动函数。
     * 该函数会在 `wait` 毫秒后调用 `func` 方法。
     * 该函数提供一个 `cancel` 方法取消延迟的函数调用以及 `flush` 方法立即调用。
     * 可以提供一个 `options ` 对象决定如何调用 `func` 方法，
     * options.leading 与|或 options.trailing 决定延迟前后如何触发。
     * `func` 会传入最后一次传入的参数给防抖动函数。
     * 随后调用的防抖动函数返回是最后一次 `func` 调用的结果。
     *
     * **注意:** 如果 `leading` 和 `trailing` 都设定为 true。
     * 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用防抖方法。
     *
     * 查看 [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * 了解 `_.debounce` 与 `_.throttle` 的区别。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要防抖动的函数
     * @param {number} [wait=0] 需要延迟的毫秒数
     * @param {Object} [options] 选项对象
     * @param {boolean} [options.leading=false] 指定调用在延迟开始前
     * @param {number} [options.maxWait] 设置 `func` 允许被延迟的最大值
     * @param {boolean} [options.trailing=true] 指定调用在延迟结束后
     * @returns {Function} 返回具有防抖动功能的函数
     * @example
     *
     * // 避免窗口在变动时出现昂贵的计算开销。
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // 当点击时 `sendMail` 随后就被调用。
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // 确保 `batchLog` 调用1次之后，1秒内会被触发。
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // 取消一个 trailing 的防抖动调用
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce (func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          leading    = false,
          maxWait    = false,
          trailing   = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading  = !!options.leading;
        maxWait  = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel () {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        args       = maxTimeoutId = thisArg = timeoutId = trailingCall = undefined;
      }

      function complete (isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result     = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed () {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function flush () {
        if ((timeoutId && trailingCall) || (maxTimeoutId && trailing)) {
          result = func.apply(thisArg, args);
        }
        cancel();
        return result;
      }

      function maxDelayed () {
        complete(trailing, timeoutId);
      }

      function debounced () {
        args         = arguments;
        stamp        = now();
        thisArg      = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled  = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result     = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result   = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }

      debounced.cancel = cancel;
      debounced.flush  = flush;
      return debounced;
    }

    /**
     * 延迟调用 `func` 直到当前堆栈清理完毕。
     * 任何附加的参数会传入到 `func`。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要延迟的函数
     * @param {...*} [args] 会在调用时传入到 `func` 的参数
     * @returns {number} 返回计时器 id
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // 一毫秒或更久一些输出 'deferred'。
     */
    var defer = rest(function (func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * 延迟 `wait` 毫秒后调用 `func`。
     * 任何附加的参数会传入到 `func`。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要延迟的函数
     * @param {number} wait 要延迟的毫秒数
     * @param {...*} [args] 会在调用时传入到 `func` 的参数
     * @returns {number} 返回计时器 id
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => 一秒后输出 'later'。
     */
    var delay = rest(function (func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * 创建一个翻转接收参数的 `func` 函数。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要翻转参数的函数
     * @returns {Function} 返回新的函数
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip (func) {
      return createWrapper(func, FLIP_FLAG);
    }

    /**
     * 创建一个会缓存 `func` 结果的函数。
     * 如果提供了 `resolver`，就用 `resolver` 的返回值作为 key 缓存函数的结果。
     * 默认情况下用第一个参数作为缓存的 key。
     * `func` 在调用时 this 会绑定在缓存函数上。
     *
     * **注意:** 
     * 缓存会暴露在缓存函数的 `cache` 上。
     * 它是可以定制的，只要替换了 _.memoize.Cache 构造函数，或实现了 [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object) 的
     * `delete`， `get`， `has`， 以及 `set`方法。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要缓存化的函数
     * @param {Function} [resolver] 这个函数的返回值作为缓存的 key
     * @returns {Function} 返回缓存化后的函数
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // 修改结果缓存
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // 替换 `_.memoize.Cache`
     * _.memoize.Cache = WeakMap;
     */
    function memoize (func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized   = function () {
        var args  = arguments,
            key   = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result     = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * 创建一个对 `func` 结果 取反的函数。
     * 用 predicate 对 `func` 检查的时候，`this` 绑定到创建的函数，并传入对应参数。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate 需要对结果取反的函数
     * @returns {Function} 返回一个新函数
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate (predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function () {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * 创建一个只能调用一次的函数。
     * 重复调用返回第一次调用的结果。
     * `func` 调用时，this 绑定到创建的函数，并传入对应参数。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 指定的触发的函数
     * @returns {Function} 返回受限的函数
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` 只能调用 `createApplication` 一次。
     */
    function once (func) {
      return before(2, func);
    }

    /**
     * 创建一个函数，调用时`func` 参数会先一对一的改变。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要包裹的函数
     * @param {...(Function|Function[])} [transforms] 这个函数会改变传参，单独指定或者指定在数组中
     * @returns {Function} 返回新函数
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = rest(function (func, transforms) {
      transforms = arrayMap(baseFlatten(transforms), getIteratee());

      var funcsLength = transforms.length;
      return rest(function (args) {
        var index  = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * 创建一个函数。
     * 该函数调用 func，并传入预设的参数。
     * 这个方法类似 `_.bind`，除了它不会绑定 `this`。
     *
     * 
     * 这个 _.partial.placeholder 的值，默认是以 _ 作为附加部分参数的占位符。
     *
     * **注意:** 这个方法不会设置 "length" 到函数上。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要预设的函数
     * @param {...*} [partials] 预设的参数
     * @returns {Function} 返回预设参数的函数
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // 使用了占位符
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = rest(function (func, partials) {
      var holders = replaceHolders(partials, partial.placeholder);
      return createWrapper(func, PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * 这个函数类似 `_.partial`，除了它是从右到左预设参数的。
     *
     * 
     * 这个 _.partialRight.placeholder 的值，默认是以 _ 作为附加部分参数的占位符。
     *
     * **注意:** 这个方法不会设置 "length" 到函数上。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 需要预设的函数
     * @param {...*} [partials] 预设的参数
     * @returns {Function} 返回预设参数的函数
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // 使用了占位符
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = rest(function (func, partials) {
      var holders = replaceHolders(partials, partialRight.placeholder);
      return createWrapper(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * 创建一个调用 `func` 的函数。
     * 所传递的参数根据 indexes 调整到对应位置。
     * 第一个 index 对应到第一个传参，第二个 index 对应到第二个传参，以此类推。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 待调用的函数
     * @param {...(number|number[])} indexes 重新排列参数的位置，单独指定或者指定在数组中
     * @returns {Function} 返回新的函数
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = rest(function (func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * 创建一个调用 `func` 的函数。
     * `this` 绑定到这个函数 并且 从 `start` 之后的参数都作为数组传入。
     * 
     * **注意:** 这个方法基于[rest parameter](https://mdn.io/rest_parameters)
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要应用的函数
     * @param {number} [start=func.length-1] 从第几个参数开始应用
     * @returns {Function} 返回新的函数
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest (func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
      return function () {
        var args   = arguments,
            index  = -1,
            length = nativeMax(args.length - start, 0),
            array  = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        switch (start) {
          case 0:
            return func.call(this, array);
          case 1:
            return func.call(this, args[0], array);
          case 2:
            return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index         = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return apply(func, this, otherArgs);
      };
    }

    /**
     * 创建一个调用 `func` 的函数。 `this` 绑定到这个函数上。
     * 把参数作为数组传入，类似于 [`Function#apply`](https://es5.github.io/#x15.3.4.3)
     *
     * **注意:** 这个方法基于 [spread operator](https://mdn.io/spread_operator)
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要应用的函数
     * @returns {Function} 返回新的函数
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // 使用在 Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => 返回 76
     */
    function spread (func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function (array) {
        return apply(func, this, array);
      };
    }

    /**
     * 创建一个节流函数，在 `wait` 秒内最多执行 `func` 一次的函数。
     * 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。
     * 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定 `wait` 前后如何触发。 func 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 func 调用的结果。 
     *
     * **注意:** 如果 leading 和 trailing 都设定为 true。 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用。 
     *
     * 查看 [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * 了解 `_.throttle` 与 `_.debounce` 的区别
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要节流的函数
     * @param {number} [wait=0] 需要节流的毫秒
     * @param {Object} [options] 选项对象
     * @param {boolean} [options.leading=true] 指定调用在节流开始前
     * @param {boolean} [options.trailing=true] 指定调用在节流结束后
     * @returns {Function} 返回节流的函数
     * @example
     *
     * // 避免在滚动时过分的更新定位
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // 点击后就调用 `renewToken`，但5分钟内超过1次。
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // 取消一个 trailing 的节流调用
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle (func, wait, options) {
      var leading  = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading  = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {'leading': leading, 'maxWait': wait, 'trailing': trailing});
    }

    /**
     * 创建一个最多接受一个参数的函数，忽略多余的参数。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func 要处理的函数
     * @returns {Function} 返回新函数
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary (func) {
      return ary(func, 1);
    }

    /**
     * 创建一个函数。提供的 `value` 包装在 wrapper 函数的第一个参数里。
     * 任何附加的参数都提供给 wrapper 函数。
     * 被调用时 `this` 绑定在创建的函数上。
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value 要包装的值
     * @param {Function} wrapper 包装函数
     * @returns {Function} 返回新的函数
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap (value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return partial(wrapper, value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * 创建一个 `value` 的浅拷贝。
     *
     * **注意:** 这个方法参考自
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * 以及支持 arrays、array buffers、 booleans、 date objects、maps、
     * numbers， `Object` objects, regexes, sets, strings, symbols, 以及 typed
     * arrays。
     * 参数对象的可枚举属性会拷贝为普通对象。
     * 一些不可拷贝的对象，例如error objects、functions, DOM nodes, 以及 WeakMaps 会返回空对象。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要拷贝的值
     * @returns {*} 返回拷贝后的值
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * console.log(shallow[0] === users[0]);
     * // => true
     */
    function clone (value) {
      return baseClone(value);
    }

    /**
     * 这个方法类似 `_.clone`，除了它接受一个 `customizer` 定制返回的拷贝值。
     * 如果 `customizer` 返回 `undefined` 将会拷贝处理方法代替。
     * `customizer` 会传入5个参数：(value [, index|key, object, stack])
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要拷贝的值
     * @param {Function} [customizer] 这个函数定制返回的拷贝值
     * @returns {*} 返回拷贝后的值
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.clone(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => BODY
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith (value, customizer) {
      return baseClone(value, false, customizer);
    }

    /**
     * 这个方法类似 `_.clone`，除了它会递归拷贝 `value`。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要深拷贝的值
     * @returns {*} 返回拷贝后的值
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * console.log(deep[0] === users[0]);
     * // => false
     */
    function cloneDeep (value) {
      return baseClone(value, true);
    }

    /**
     * 这个方法类似 `_.cloneWith`，除了它会递归拷贝 `value`。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要深拷贝的值
     * @param {Function} [customizer] 这个函数定制返回的拷贝值
     * @returns {*} 返回拷贝后的值
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeep(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => BODY
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith (value, customizer) {
      return baseClone(value, true, customizer);
    }

    /**
     * 执行 [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero) 比较两者的值确定它们是否相等。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 相等返回 `true`，否则返回 `false`
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq (value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * 检查 `value` 是否大于 `other`
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 如果 `value` 大于 `other`，返回 `true`，否则返回 `false`
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt (value, other) {
      return value > other;
    }

    /**
     * 检查 `value` 是否大于等于 `other`
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 如果 `value` 大于等于 `other`，返回 `true`，否则返回 `false`
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte (value, other) {
      return value >= other;
    }

    /**
     * 检查 `value` 是否是 类 `arguments` 对象。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments (value) {
      // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
      return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
        (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
    }

    /**
     * 检查 `value` 是否是 `Array` 类对象。
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * 检查 `value` 是否是类数组。
     * 如果是类数组的话，应该不是一个函数，而且 `value.length` 是个整数，大于等于 0，小于或等于 `Number.MAX_SAFE_INTEGER`
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是类数组，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike (value) {
      return value != null && !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
    }

    /**
     * 这个方法类似 `_.isArrayLike`，除了它还检查值是否是个对象。
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是类数组对象，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject (value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * 检查 `value` 是否是原始 boolean 类型或者对象。 
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean (value) {
      return value === true || value === false ||
        (isObjectLike(value) && objectToString.call(value) == boolTag);
    }

    /**
     * 检查 `value` 是否是 `Date` 类型
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate (value) {
      return isObjectLike(value) && objectToString.call(value) == dateTag;
    }

    /**
     * 检查 `value` 是否是可能是 DOM 元素
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是 DOM 元素返回 `true`，否则返回 `false`
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement (value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * 检查 `value` 是否为空。
     * 判断的依据是除非是有枚举属性的对象，length 大于 `0` 的 `arguments` object, array, string 或类jquery选择器。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value 要检查的值
     * @returns {boolean} 如果为空返回 `true`，否则返回 `false`
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty (value) {
      return (!isObjectLike(value) || isFunction(value.splice))
        ? !size(value)
        : !keys(value).length;
    }

    /**
     * 执行深比较来决定两者的值是否相等。
     *
     * **注意:** 这个方法支持比较 arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, 以及 typed arrays. `Object` 对象值比较自身的属性，不包括继承的和可枚举的属性。
     * 不支持函数和DOM节点。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 如果相等返回 `true`，否则返回 `false`
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual (value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * 这个方法类似 `_.isEqual`。
     * 除了它接受一个 customizer 定制比较值。 如果 customizer 返回 undefined 将会比较处理方法代替。
     * `customizer` 会传入7个参数：(objValue, othValue [, index|key, object, other, stack])
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @param {Function} [customizer] 这个函数定制比较值
     * @returns {boolean} 如果相等返回 `true`，否则返回 `false`
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith (value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * 检查 `value` 是否是 `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, 或 `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是 error object 返回 `true`，否则返回 `false`
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError (value) {
      return isObjectLike(value) &&
        typeof value.message == 'string' && objectToString.call(value) == errorTag;
    }

    /**
     * 检查 `value` 是否是原始 finite number。
     *
     * **注意:** 这个方法基于 [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是 finite number 返回 `true`，否则返回 `false`
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MAX_VALUE);
     * // => true
     *
     * _.isFinite(3.14);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite (value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * 检查 `value` 是否是 `Function` 对象。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction (value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8 which returns 'object' for typed array constructors, and
      // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * 检查 `value` 是否是整数。
     *
     * **注意:** 这个方法基于 [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是整数返回 `true`，否则返回 `false`
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger (value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * 检查 `value` 是否是有效长度
     *
     * **注意:** 这个方法参考自 [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是有效长度返回 `true`，否则返回 `false`
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength (value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * 检查 `value` 是否是 `Object` 的 [language type](https://es5.github.io/#x8)。
     * (例如： arrays, functions, objects, regexes, `new Number(0)`, 以及 `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是对象返回 `true`，否则返回 `false`
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject (value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 了解详情
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * 检查 `value` 是否是 类对象。
     * 类对象应该不是 `null` 以及 `typeof` 的结果是 "object"。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是类对象返回 `true`，否则返回 `false`
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike (value) {
      return !!value && typeof value == 'object';
    }

    /**
     * 执行一个深比较来确定`object` 是否包含有 `source` 的属性值。
     *
     * **注意:** 这个方法支持比较相同的值和 `_.isEqual` 一样
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object 要检查的值
     * @param {Object} source 匹配包含在 object 的对象
     * @returns {boolean} 如果匹配返回 `true`，否则返回 `false`
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     */
    function isMatch (object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * 这个方法类似 `_.isMatch`。
     * 除了它接受一个 customizer 定制比较的值。 
     * 如果 customizer 返回 undefined 将会比较处理方法代替。 customizer 会传入5个参数：(objValue, srcValue, index|key, object, source)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object 要检查的值
     * @param {Object} source 匹配包含在 object 的对象
     * @param {Function} [customizer] 这个函数定制比较值
     * @returns {boolean} 如果匹配返回 `true`，否则返回 `false`
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith (object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * 检查 `value` 是否是 `NaN`.
     *
     * **注意:** 这个方法不同于 [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * 对 undefind 和 其他非数值返回 true.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果符合 `NaN` 返回 `true`，否则返回 `false`
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN (value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * 检查 `value` 是否是原生函数
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是原生函数返回 `true`，否则返回 `false`
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative (value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(funcToString.call(value));
      }
      return isObjectLike(value) &&
        (isHostObject(value) ? reIsNative : reIsHostCtor).test(value);
    }

    /**
     * 检查 `value` 是否是 `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是 `null` 返回 `true`，否则返回 `false`
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull (value) {
      return value === null;
    }

    /**
     * 检查 `value` 是否是 `null` 或者 `undefined`。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是 `null` 或者 `undefined` 返回 `true`，否则返回 `false`
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil (value) {
      return value == null;
    }

    /**
     * 检查 `value` 是否是原始数值型 或者 对象。
     *
     * **注意:** 要排除 `Infinity`, `-Infinity`, 以及 `NaN` 数值类型，用 `_.isFinite` 方法
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber (value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && objectToString.call(value) == numberTag);
    }

    /**
     * 检查 `value` 是否是普通对象。
     * 也就是说该对象由 `Object` 构造函数创建或者 `[[Prototype]]` 为空。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是普通对象返回 `true`，否则返回 `false`
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject (value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = objectProto;
      if (typeof value.constructor == 'function') {
        proto = getPrototypeOf(value);
      }
      if (proto === null) {
        return true;
      }
      var Ctor = proto.constructor;
      return (typeof Ctor == 'function' &&
      Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
    }

    /**
     * 检查 `value` 是否是 `RegExp` 对象
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp (value) {
      return isObject(value) && objectToString.call(value) == regexpTag;
    }

    /**
     * 检查 `value` 是否是安全整数。
     * 这个整数应该是符合 IEEE-754 标准的非双精度浮点数。
     * 
     * **注意:** 这个方法基于 [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是安全整数返回`true`，否则返回 `false`
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger (value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * 检查 `value` 是否是原始字符串或者对象。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString (value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
    }

    /**
     * 检查 `value` 是否是原始 `Symbol` 或者对象。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol (value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    /**
     * 检查 `value` 是否是TypedArray。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} 如果是正确的类型，返回 `true`，否则返回 `false`
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray (value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }

    /**
     * 检查 `value` 是否是 `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要检查的值
     * @returns {boolean} Returns `true` if `value` is `undefined`否则返回 `false`
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined (value) {
      return value === undefined;
    }

    /**
     * 检查 `value` 是否是 小于 `other`。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 如果 `value` 小于 `other` 返回 `true`，否则返回 `false`
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt (value, other) {
      return value < other;
    }

    /**
     * 检查 `value` 是否是 小于等于 `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要比较的值
     * @param {*} other 其他要比较的值
     * @returns {boolean} 如果 `value` 小于等于 `other` 返回 `true`，否则返回 `false`
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte (value, other) {
      return value <= other;
    }

    /**
     * 转换 `value` 为数组
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {Array} 然后转换后的数组
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray (value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (iteratorSymbol && value[iteratorSymbol]) {
        return iteratorToArray(value[iteratorSymbol]());
      }
      var tag  = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * 转换 `value` 为整数
     *
     * **注意:** 这个函数参考 [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {number} 返回转换后的整数
     * @example
     *
     * _.toInteger(3);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3');
     * // => 3
     */
    function toInteger (value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      var remainder = value % 1;
      return value === value ? (remainder ? value - remainder : value) : 0;
    }

    /**
     * 转换 `value` 为用作类数组对象的长度整数。
     *
     * **注意:** 这个方法基于 [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {number} 返回转换后的整数
     * @example
     *
     * _.toLength(3);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3');
     * // => 3
     */
    function toLength (value) {
      if (!value) {
        return 0;
      }
      return clamp(toInteger(value), 0, MAX_ARRAY_LENGTH);
    }

    /**
     * 转换 `value` 为数值
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要处理的值
     * @returns {number} 返回数值
     * @example
     *
     * _.toNumber(3);
     * // => 3
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3');
     * // => 3
     */
    function toNumber (value) {
      if (!value) {
        return value === 0 ? value : +value;
      }
      if (isObject(value)) {
        var other = isFunction(value.valueOf) ? value.valueOf() : value;
        value     = isObject(other) ? (other + '') : other;
      }
      if (typeof value == 'number' || !isString(value)) {
        return +value;
      }
      value        = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? nativeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * 转换 `value` 为普通对象。
     * 包括继承的可枚举属性。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {Object} 返回转换后的普通对象
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject (value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * 转换 `value` 为安全整数。
     * 安全整数可以用于比较和准确的表示。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {number} 返回转换后的整数
     * @example
     *
     * _.toSafeInteger(3);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3');
     * // => 3
     */
    function toSafeInteger (value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      return clamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    }

    /**
     * 如果 `value` 不是字符串，将其转换为字符串。
     * `null` 和 `undefined` 将返回空字符串。
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value 要转换的值
     * @returns {string} 返回字符串
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString (value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (value == null) {
        return '';
      }
      var result = isSymbol(value) ? symbolToString.call(value) : (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * 分配来源对象的可枚举属性到目标对象上。
     * 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性。
     *
     * **注意:** 这方法会改变源对象，参考自
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} [sources] 来源对象
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.c = 3;
     * }
     *
     * function Bar() {
     *   this.e = 5;
     * }
     *
     * Foo.prototype.d = 4;
     * Bar.prototype.f = 6;
     *
     * _.assign({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3, 'e': 5 }
     */
    var assign = createAssigner(function (object, source) {
      copyObject(source, keys(source), object);
    });

    /**
     * 这个方法类似 `_.assign`。
     * 除了它会遍历并继承来源对象的属性。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} [sources] 来源对象
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * function Bar() {
     *   this.d = 4;
     * }
     *
     * Foo.prototype.c = 3;
     * Bar.prototype.e = 5;
     *
     * _.assignIn({ 'a': 1 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5 }
     */
    var assignIn = createAssigner(function (object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * 这个方法类似 `_.assignIn`。
     * 除了它接受一个 customizer` 决定如何分配值。
     * 如果 `customizer` 返回 `undefined` 将会由分配处理方法代替。
     * `customizer` 会传入5个参数：(objValue, srcValue, key, object, source)。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @alias extendWith
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} sources 来源对象
     * @param {Function} [customizer] 这个函数决定分配的值
     * @returns {Object} 返回对象
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function (object, source, customizer) {
      copyObjectWith(source, keysIn(source), object, customizer);
    });

    /**
     * 这个方法类似 `_.assign`。
     * 除了它接受一个 customizer` 决定如何分配值。
     * 如果 `customizer` 返回 `undefined` 将会由分配处理方法代替。
     * `customizer` 会传入5个参数：(objValue, srcValue, key, object, source)。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} sources 来源对象
     * @param {Function} [customizer] 这个函数决定分配的值
     * @returns {Object} 返回对象
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function (object, source, customizer) {
      copyObjectWith(source, keys(source), object, customizer);
    });

    /**
     * 根据 `object` 的路径获取值为数组。
     * 
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {...(string|string[])} [paths] 要获取的对象的元素路径，单独指定或者指定在数组中
     * @returns {Array} 返回选中值的数组
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     *
     * _.at(['a', 'b', 'c'], 0, 2);
     * // => ['a', 'c']
     */
    var at = rest(function (object, paths) {
      return baseAt(object, baseFlatten(paths));
    });

    /**
     * 创建一个继承 `prototype` 的对象。
     * 如果提供了 `properties`，它的可枚举属性会被分配到创建的对象上。
     * 
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype 要继承的对象
     * @param {Object} [properties] 待分配的属性
     * @returns {Object} 返回新对象
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create (prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * 分配来源对象的可枚举属性到目标对象所有解析为 `undefined` 的属性上。
     * 来源对象从左到右应用。
     * 一旦设置了相同属性的值，后续的将被忽略掉。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} [sources] 来源对象
     * @returns {Object} 返回对象
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = rest(function (args) {
      args.push(undefined, assignInDefaults);
      return apply(assignInWith, undefined, args);
    });

    /**
     * 这个方法类似 `_.defaults`，除了它会递归分配默认属性。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} [sources] 来源对象
     * @returns {Object} 返回对象
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = rest(function (args) {
      args.push(undefined, mergeDefaults);
      return apply(mergeWith, undefined, args);
    });

    /**
     * 这个方法类似 `_.find`。
     * 除了它返回最先被 `predicate` 判断为真值的元素 key，而不是元素本身。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 需要检索的对象
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {string|undefined} 返回匹配的 key，否则返回 `undefined`。
     * 
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (无法保证遍历的顺序)
     *
     * // 使用了 `_.matches` 的回调结果
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // 使用了 `_.property` 的回调结果
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey (object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwn, true);
    }

    /**
     * 这个方法类似 `_.findKey`。
     * 不过它是反方向开始遍历的。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 需要检索的对象
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会处理每一个元素
     * @returns {string|undefined} 返回匹配的 key，否则返回 `undefined`。
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => 返回 'pebbles'， `_.findKey` 会返回 'barney'
     *
     * // 使用了 `_.matches` 的回调结果
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // 使用了 `_.matchesProperty` 的回调结果
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // 使用了 `_.property` 的回调结果
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey (object, predicate) {
      return baseFind(object, getIteratee(predicate, 3), baseForOwnRight, true);
    }

    /**
     * 使用 `iteratee` 遍历对象的自身和继承的可枚举属性。
     * iteratee 会传入3个参数：(value, key, object)。
     * 如果返回 false，iteratee 会提前退出遍历。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => 输出 'a', 'b', 然后 'c' (无法保证遍历的顺序)
     */
    function forIn (object, iteratee) {
      return object == null ? object : baseFor(object, toFunction(iteratee), keysIn);
    }

    /**
     * 这个方法类似 `_.forIn`。
     * 除了它是反方向开始遍历的。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => 输出 'c', 'b', 然后 'a'， `_.forIn` 会输出 'a', 'b', 然后 'c'
     */
    function forInRight (object, iteratee) {
      return object == null ? object : baseForRight(object, toFunction(iteratee), keysIn);
    }

    /**
     * 使用 `iteratee` 遍历自身的可枚举属性。
     * iteratee 会传入3个参数：(value, key, object)。 如果返回 false，iteratee 会提前退出遍历。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => 输出 'a' 然后 'b' (无法保证遍历的顺序)
     */
    function forOwn (object, iteratee) {
      return object && baseForOwn(object, toFunction(iteratee));
    }

    /**
     * 这个方法类似 `_.forOwn`。 除了它是反方向开始遍历的。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回对象
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => 输出 'b' 然后 'a'， `_.forOwn` 会输出 'a' 然后 'b'
     */
    function forOwnRight (object, iteratee) {
      return object && baseForOwnRight(object, toFunction(iteratee));
    }

    /**
     * 返回一个 function 对象自身可枚举属性名的数组。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回包含属性名的新数组
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions (object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * 返回一个 function 对象自身和继承的可枚举属性名的数组。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回包含属性名的新数组
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn (object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * 根据对象路径获取值。
     * 如果解析 value 是 `undefined` 会以 `defaultValue` 取代。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要获取的对象路径
     * @param {*} [defaultValue] 如果解析值是 `undefined`，这值会被返回
     * @returns {*} 返回解析的值
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get (object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * 检查 `path` 是否是对象的直接属性。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要检查的路径
     * @returns {boolean} 如果存在返回 true，否则返回 `false`
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has (object, path) {
      return hasPath(object, path, baseHas);
    }

    /**
     * 检查 `path` 是否是对象的直接 或者 继承属性。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要检查的路径
     * @returns {boolean} 如果存在返回 true，否则返回 `false`
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b.c');
     * // => true
     *
     * _.hasIn(object, ['a', 'b', 'c']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn (object, path) {
      return hasPath(object, path, baseHasIn);
    }

    /**
     * 创建一个键值倒置的对象。
     * 如果 `object` 有重复的值，后面的值会覆盖前面的值。
     * 如果 `multiVal` 为 true，重复的值则组成数组。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要倒置的对象
     * @param {boolean} [multiVal] 每个 key 允许多个值
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Object} 返回新的倒置的对象
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // 使用 `multiVal`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert (object, multiVal, guard) {
      return arrayReduce(keys(object), function (result, key) {
        var value = object[key];
        if (multiVal && !guard) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
        return result;
      }, {});
    }

    /**
     * 调用对象路径的方法
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要调用方法的路径
     * @param {...*} [args] 调用方法的参数
     * @returns {*} 返回调用方法的结果
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = rest(baseInvoke);

    /**
     * 创建 `object` 自身可枚举属性名为一个数组。
     *
     * **注意:** 非对象的值会被强制转换为对象，查看
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * 了解详情
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回包含属性名的数组
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (无法保证遍历的顺序)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys (object) {
      var isProto = isPrototype(object);
      if (!(isProto || isArrayLike(object))) {
        return baseKeys(object);
      }
      var indexes     = indexKeys(object),
          skipIndexes = !!indexes,
          result      = indexes || [],
          length      = result.length;

      for (var key in object) {
        if (baseHas(object, key) && !(skipIndexes && (key == 'length' || isIndex(key, length))) && !(isProto && key == 'constructor')) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * 创建 `object` 自身 或 继承的可枚举属性名为一个数组。
     * 
     * **注意:** 非对象的值会被强制转换为对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回包含属性名的数组
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (无法保证遍历的顺序)
     */
    function keysIn (object) {
      var index       = -1,
          isProto     = isPrototype(object),
          props       = baseKeysIn(object),
          propsLength = props.length,
          indexes     = indexKeys(object),
          skipIndexes = !!indexes,
          result      = indexes || [],
          length      = result.length;

      while (++index < propsLength) {
        var key = props[index];
        if (!(skipIndexes && (key == 'length' || isIndex(key, length))) && !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * 反向版 `_.mapValues`。
     * 这个方法创建一个对象，对象的值与源对象相同，但 key 是通过 `iteratee` 产生的。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回映射后的新对象
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys (object, iteratee) {
      var result = {};
      iteratee   = getIteratee(iteratee, 3);

      baseForOwn(object, function (value, key, object) {
        result[iteratee(value, key, object)] = value;
      });
      return result;
    }

    /**
     * 创建一个对象，对象的key相同，值是通过 `iteratee` 产生的。
     * iteratee 会传入3个参数： (value, key, object)
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要遍历的对象
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Object} 返回映射后的对象
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (无法保证遍历的顺序)
     *
     * // 使用了 `_.property` 的回调结果
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (无法保证遍历的顺序)
     */
    function mapValues (object, iteratee) {
      var result = {};
      iteratee   = getIteratee(iteratee, 3);

      baseForOwn(object, function (value, key, object) {
        result[key] = iteratee(value, key, object);
      });
      return result;
    }

    /**
     * 递归合并来源对象的自身和继承的可枚举属性到目标对象。
     * 跳过来源对象解析为 `undefined` 的属性。
     * 数组和普通对象会递归合并，其他对象和值会被直接分配。
     * 来源对象从左到右分配，后续的来源对象属性会覆盖之前分配的属性。
     *
     * **注意:** 这方法会改变源对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} [sources] 来源对象
     * @returns {Object} 返回对象
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     */
    var merge = createAssigner(function (object, source) {
      baseMerge(object, source);
    });

    /**
     * 这个方法类似 `_.merge`。
     * 除了它接受一个 `customizer` 决定如何合并。
     * 如果 `customizer` 返回 `undefined` 将会由合并处理方法代替。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 目标对象
     * @param {...Object} sources 来源对象
     * @param {Function} customizer 这个方法决定如何合并
     * @returns {Object} 返回对象
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var mergeWith = createAssigner(function (object, source, customizer) {
      baseMerge(object, source, customizer);
    });

    /**
     * 反向版 `_.pick`。
     * 这个方法返回忽略属性之外的自身和继承的可枚举属性。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 来源对象
     * @param {...(string|string[])} [props] 要被忽略的属性，单独指定或指定在数组中
     * @returns {Object} 返回新对象
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'user');
     * // => { 'age': 40 }
     */
    var omit = rest(function (object, props) {
      if (object == null) {
        return {};
      }
      props = arrayMap(baseFlatten(props), String);
      return basePick(object, baseDifference(keysIn(object), props));
    });

    /**
     * 反向版 `_.pickBy`。
     * 这个方法返回经 `predicate` 判断不是真值的属性的自身和继承的可枚举属性。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 来源对象
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会调用每一个属性
     * @returns {Object} 返回新对象
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    function omitBy (object, predicate) {
      predicate = getIteratee(predicate);
      return basePickBy(object, function (value) {
        return !predicate(value);
      });
    }

    /**
     * 创建一个从 `object` 中选中的属性的对象。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 来源对象
     * @param {...(string|string[])} [props] 要选中的属性名，单独指定或指定在数组中
     * @returns {Object} 返回新对象
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     */
    var pick = rest(function (object, props) {
      return object == null ? {} : basePick(object, baseFlatten(props));
    });

    /**
     * 创建一个从 `object` 中经 `predicate` 判断为真值的属性为对象。
     * predicate 会传入1个参数：(value)
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 来源对象
     * @param {Function|Object|string} [predicate=_.identity] 这个函数会调用每一个属性
     * @returns {Object} 返回新对象
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'age': 40 }
     */
    function pickBy (object, predicate) {
      return object == null ? {} : basePickBy(object, getIteratee(predicate));
    }

    /**
     * 这个方法类似 `_.get`。
     * 除了如果解析到的值是一个函数的话，就绑定 `this` 到这个函数并返回执行后的结果。 
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @param {Array|string} path 要解析的属性路径
     * @param {*} [defaultValue] 如果值是 `undefined`，返回这个值
     * @returns {*} 返回解析后的值
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result (object, path, defaultValue) {
      if (!isKey(path, object)) {
        path       = baseToPath(path);
        var result = get(object, path);
        object     = parent(object, path);
      } else {
        result = object == null ? undefined : object[path];
      }
      if (result === undefined) {
        result = defaultValue;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * 设置值到对象对应的属性路径上，如果没有则创建这部分路径。
     * 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。
     * 使用 `_.setWith` 定制创建。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要修改的对象
     * @param {Array|string} path 要设置的对象路径
     * @param {*} value 要设置的值
     * @returns {Object} 返回对象
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set (object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * 这个方法类似 `_.set`。
     * 除了它接受一个 `customizer` 决定如何设置对象路径的值。
     * 如果 `customizer` 返回 `undefined` 将会有它的处理方法代替。
     * `customizer` 会传入3个参数：(nsValue, key, nsObject)
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要修改的对象
     * @param {Array|string} path 要设置的对象路径
     * @param {*} value 要设置的值
     * @param {Function} [customizer] 这个函数决定如何分配值
     * @returns {Object} 返回对象
     * @example
     *
     * _.setWith({ '0': { 'length': 2 } }, '[0][1][2]', 3, Object);
     * // => { '0': { '1': { '2': 3 }, 'length': 2 } }
     */
    function setWith (object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * 创建一个对象自身可枚举属性的键值对数组。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回键值对的数组
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (无法保证遍历的顺序)
     */
    function toPairs (object) {
      return baseToPairs(object, keys(object));
    }

    /**
     * 创建一个对象自身和继承的可枚举属性的键值对数组。
     * 
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回键值对的数组
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 1]] (无法保证遍历的顺序)
     */
    function toPairsIn (object) {
      return baseToPairs(object, keysIn(object));
    }

    /**
     * `_.reduce` 的代替方法。
     * 这个方法会改变对象为一个新的 `accumulator` 对象，来自每一次经 `iteratee` 处理自身可枚举对象的结果。
     * 每次调用可能会改变 `accumulator` 对象。
     * iteratee 会传入4个对象：(accumulator, value, key, object)。
     * 如果返回 `false`，iteratee 会提前退出。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object 要遍历的对象
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @param {*} [accumulator] 定制叠加的值
     * @returns {*} 返回叠加后的值
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * });
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform (object, iteratee, accumulator) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee  = getIteratee(iteratee, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function (value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * 移除对象路径的属性。
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要修改的对象
     * @param {Array|string} path 要移除的对象路径
     * @returns {boolean} 移除成功返回 `true`，否则返回 `false`
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset (object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * 创建 `object` 自身可枚举属性的值为数组
     *
     * **注意:** 非对象的值会强制转换为对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} 返回对象属性的值的数组
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (无法保证遍历的顺序)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values (object) {
      return object ? baseValues(object, keys(object)) : [];
    }

    /**
     * 创建 `object` 自身和继承的可枚举属性的值为数组
     * 
     * **注意:** 非对象的值会强制转换为对象
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object 要检索的对象
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (无法保证遍历的顺序)
     */
    function valuesIn (object) {
      return object == null ? baseValues(object, keysIn(object)) : [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * 返回限制在 `min` 和 `max` 之间的值
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number 被限制的值
     * @param {number} [min] 最小绝对值
     * @param {number} max 最大绝对值
     * @returns {number} [min, max] 中的一个
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp (number, min, max) {
      number = toNumber(number);
      if (number === number) {
        if (max === undefined) {
          max = min;
          min = undefined;
        }
        if (max !== undefined) {
          max    = toNumber(max);
          max    = max === max ? max : 0;
          number = number <= max ? number : max;
        }
        if (min !== undefined) {
          min    = toNumber(min);
          min    = min === min ? min : 0;
          number = number >= min ? number : min;
        }
      }
      return number;
    }

    /**
     * 检查 `n` 是否在 `start` 与 `end` 之间，但不包括 `end`。
     * 如果 `end` 没有指定，那么 `start` 设置为0。
     * 如果 `start` 大于 `end`，那么参数会交换以便支持负范围。
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} number 要检查的值
     * @param {number} [start=0] 开始范围
     * @param {number} end 结束范围
     * @returns {boolean} 如果值在范围内返回`true`，否则返回 `false`
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange (number, start, end) {
      start = toNumber(start) || 0;
      if (end === undefined) {
        end   = start;
        start = 0;
      } else {
        end = toNumber(end) || 0;
      }
      number = toNumber(number);
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * 产生一个包括  `min` 与 `max` 之间的数。
     * 如果只提供一个参数返回一个0到提供数之间的数。
     * 如果 `floating` 设为 true，或者 `min` 或 `max` 是浮点数，结果返回浮点数。
     *
     * **注意:** JavaScript 遵循 IEEE-754 标准处理无法预料的浮点数结果。
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] 最小值
     * @param {number} [max=1] 最大值
     * @param {boolean} [floating] 是否返回浮点数
     * @returns {number} 返回随机数
     * @example
     *
     * _.random(0, 5);
     * // =>  0 和 5 之间的数
     *
     * _.random(5);
     * // => 同样是 0 和 5 之间的数
     *
     * _.random(5, true);
     * // => 0 和 5 之间的浮点数
     *
     * _.random(1.2, 5.2);
     * // =>  1.2 和 5.2 之间的浮点数
     */
    function random (min, max, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof max == 'boolean') {
          floating = max;
          max      = undefined;
        }
        else if (typeof min == 'boolean') {
          floating = min;
          min      = undefined;
        }
      }
      if (min === undefined && max === undefined) {
        min = 0;
        max = 1;
      }
      else {
        min = toNumber(min) || 0;
        if (max === undefined) {
          max = min;
          min = 0;
        } else {
          max = toNumber(max) || 0;
        }
      }
      if (min > max) {
        var temp = min;
        min      = max;
        max      = temp;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * 转换字符串为 [驼峰写法](https://en.wikipedia.org/wiki/CamelCase)
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} 返回驼峰写法的字符串
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function (result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * 转换字符串首字母为大写，剩下为小写。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要大写开头的字符串
     * @returns {string} 返回大写开头的字符串
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize (string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * 转换 [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table) 为基本拉丁字母，并删除[变音符](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks)。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要处理的字符串
     * @returns {string} 返回处理后的字符串
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr (string) {
      string = toString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * 检查给定的字符是否是字符串的结尾
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要检索的字符串
     * @param {string} [target] 要检索字符
     * @param {number} [position=string.length] 检索的位置
     * @returns {boolean} 如果是结尾返回 `true`，否则返回 `false`
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith (string, target, position) {
      string = toString(string);
      target = typeof target == 'string' ? target : (target + '');

      var length = string.length;
      position   = position === undefined
        ? length
        : clamp(toInteger(position), 0, length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * 转义字符 "&", "<", ">", '"', "'", 以及 "\`" 为HTML实体字符。
     *
     * **注意:** 不会转义其他字符，如果需要，可以使用第三方库，例如 [_he_](https://mths.be/he)。
     *
     * 虽然 ">" 是对称转义的，像是 ">" 和 "/" 没有特殊的意义，所以不需要在 HTML 中转义。
     * 除非它们是标签的一部分，或者是不带引号的属性值。
     * 查看 [Mathias Bynens 的文章](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") 了解详情
     *
     * 在 IE < 9 中转义引号，因为会中断属性值或 HTML 注释，查看
     * [HTML5 安全列表](https://html5sec.org/) 的 [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), 以及
     * [#133](https://html5sec.org/#133) 了解详情
     *
     * 当解析为 HTML 时应该总是 [引用属性值](http://wonko.com/post/html-escaping)
     * 以减少 XSS 的可能性。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转义的字符串
     * @returns {string} 返回转义后的字符串
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape (string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * 转义`RegExp` 中特殊的字符 "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", 以及 "|"。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转义的字符串
     * @returns {string} 返回转义后的字符串
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp (string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * 转换字符串为 [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles)。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} 返回转换后的字符串
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function (result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * 以空格分开单词并转换为小写。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} 返回小写的字符串
     * @example
     *
     * _.lowerCase('--Foo-Bar');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function (result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * 转换首字母为小写。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} 返回转换后的字符串
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * 转换首字母为大写。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} 返回转换后的字符串
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * 如果字符串长度小于 `length` 则从左到右填充字符。
     * 如果没法平均分配，则截断超出的长度。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要填充的字符串
     * @param {number} [length=0] 填充的长度
     * @param {string} [chars=' '] 填充字符
     * @returns {string} 返回填充后的字符串
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad (string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = stringSize(string);
      if (!length || strLength >= length) {
        return string;
      }
      var mid         = (length - strLength) / 2,
          leftLength  = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      return createPadding('', leftLength, chars) + string + createPadding('', rightLength, chars);
    }

    /**
     * 如果字符串长度小于 length 则在右侧填充字符。 如果超出长度则截断超出的部分。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要填充的字符串
     * @param {number} [length=0] 填充的长度
     * @param {string} [chars=' '] 填充字符
     * @returns {string} Returns 返回填充后的字符串
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd (string, length, chars) {
      string = toString(string);
      return string + createPadding(string, length, chars);
    }

    /**
     * 如果字符串长度小于 length 则在左侧填充字符。 如果超出长度则截断超出的部分。
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要填充的字符串
     * @param {number} [length=0] 填充的长度
     * @param {string} [chars=' '] 填充字符
     * @returns {string} Returns 返回填充后的字符串
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart (string, length, chars) {
      string = toString(string);
      return createPadding(string, length, chars) + string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **注意:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string 要转换的字符串
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt (string, radix, guard) {
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 了解详情
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = baseTrim(toString(string));
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat (string, n) {
      string = toString(string);
      n      = toInteger(n);

      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring 了解详情
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **注意:** This method is based on [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace () {
      var args   = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function (result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **注意:** This method is based on [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the new array of string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split (string, separator, limit) {
      return toString(string).split(separator, limit);
    }

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function (result, word, index) {
      return result + (index ? ' ' : '') + capitalize(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要检索的字符串
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] 检索的位置
     * @returns {boolean} Returns `true` if `string` starts with `target`否则返回 `false`
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith (string, target, position) {
      string   = toString(string);
      position = clamp(toInteger(position), 0, string.length);
      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **注意:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string  = toString(string);
      options = assignInWith({}, options, settings, assignInDefaults);

      var imports       = assignInWith({}, options.imports, settings.imports, assignInDefaults),
          importsKeys   = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index       = 0,
          interpolate = options.interpolate || reNoMatch,
          source      = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
        , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
            ? options.sourceURL
            : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
            ? ''
            : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
            ? ', __e = _.escape'
            : ''
        ) +
        (isEvaluating
            ? ', __j = Array.prototype.join;\n' +
          "function print() { __p += __j.call(arguments, '') }\n"
            : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function () {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar');
     * // => '--foo-bar'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower (value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar');
     * // => '--FOO-BAR'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper (value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim (string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return baseTrim(string);
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars);

      return strSymbols.slice(charsStartIndex(strSymbols, chrSymbols), charsEndIndex(strSymbols, chrSymbols) + 1).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd (string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols.slice(0, charsEndIndex(strSymbols, stringToArray(chars)) + 1).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart (string, chars, guard) {
      string = toString(string);
      if (!string) {
        return string;
      }
      if (guard || chars === undefined) {
        return string.slice(trimmedStartIndex(string));
      }
      chars = (chars + '');
      if (!chars) {
        return string;
      }
      var strSymbols = stringToArray(string);
      return strSymbols.slice(charsStartIndex(strSymbols, stringToArray(chars))).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate (string, options) {
      var length   = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length        = 'length' in options ? toInteger(options.length) : length;
        omission      = 'omission' in options ? toString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (reHasComplexSymbol.test(string)) {
        var strSymbols = stringToArray(string);
        strLength      = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? strSymbols.slice(0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **注意:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape (string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] 要转换的字符串
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function (result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words (string, pattern, guard) {
      string  = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = rest(function (func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **注意:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind,
     *  specified individually or in arrays.
     * @returns {Object} 返回对象
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, 'onClick');
     * jQuery(element).on('click', view.onClick);
     * // => logs 'clicked docs' when clicked
     */
    var bindAll = rest(function (object, methodNames) {
      arrayEach(baseFlatten(methodNames), function (key) {
        object[key] = bind(object[key], object);
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` invoking the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.constant(true),                _.constant('no match')]
     * ])
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond (pairs) {
      var length     = pairs ? pairs.length : 0,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function (pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return rest(function (args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy否则返回 `false`
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.filter(users, _.conforms({ 'age': _.partial(_.gt, _, 38) }));
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function conforms (source) {
      return baseConforms(baseClone(source, true));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant (value) {
      return function () {
        return value;
      };
    }

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * 这个方法类似 `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {...(Function|Function[])} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity (value) {
      return value;
    }

    /**
     * 创建一个调用 `func` 的函数。 with the arguments of the created
     * function. If `func` is a property name the created callback returns the
     * property value for a given element. If `func` is an object the created
     * callback returns `true` for elements that contain the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.iteratee = _.wrap(_.iteratee, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function iteratee (func) {
      return (isObjectLike(func) && !isArray(func))
        ? matches(func)
        : baseIteratee(func);
    }

    /**
     * Creates a function that performs a deep partial comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values否则返回 `false`
     *
     * **注意:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches (source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that performs a deep partial comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent否则返回 `false`
     *
     * **注意:** This method supports comparing the same values as `_.isEqual`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty (path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invokeMap(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = rest(function (path, args) {
      return function (object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object 要检索的对象
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = rest(function (object, args) {
      return function (path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **注意:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] 目标对象
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} 返回对象
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin (object, source, options) {
      var props       = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
        options     = source;
        source      = object;
        object      = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain  = (isObject(options) && 'chain' in options) ? options.chain : true,
          isFunc = isFunction(object);

      arrayEach(methodNames, function (methodName) {
        var func           = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function () {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result  = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({'func': func, 'args': arguments, 'thisArg': object});
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict () {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop () {
      // No operation performed.
    }

    /**
     * Creates a function that returns its nth argument.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.nthArg(1);
     *
     * func('a', 'b', 'c');
     * // => 'b'
     */
    function nthArg (n) {
      n = toInteger(n);
      return function () {
        return arguments[n];
      };
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments provided
     * to the created function and returns their results.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {...(Function|Function[])} iteratees The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over(Math.max, Math.min);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments provided to the created function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {...(Function|Function[])} predicates The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome(Boolean, isFinite);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property (path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object 要检索的对象
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf (object) {
      return function (path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified
     * it's set to `start` with `start` then set to `0`.  If `end` is less than
     * `start` a zero-length range is created unless a negative `step` is specified.
     *
     * **注意:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range (start, end, step) {
      if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      return baseRange(start, end, step);
    }

    /**
     * 这个方法类似 `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    function rangeRight (start, end, step) {
      if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      return baseRange(start, end, step, true);
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(true));
     * // => [true, true, true, true]
     */
    function times (n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index  = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = toFunction(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     *
     * var path = ['a', 'b', 'c'],
     *     newPath = _.toPath(path);
     *
     * console.log(newPath);
     * // => ['a', 'b', 'c']
     *
     * console.log(path === newPath);
     * // => false
     */
    function toPath (value) {
      return isArray(value) ? arrayMap(value, String) : stringToPath(value);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId (prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * 相加两个数
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend 相加的第一个数
     * @param {number} addend 相加的第二个数
     * @returns {number} 返回总和
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add (augend, addend) {
      var result;
      if (augend !== undefined) {
        result = augend;
      }
      if (addend !== undefined) {
        result = result === undefined ? addend : (result + addend);
      }
      return result;
    }

    /**
     * 根据 `precision` 向上舍入 `number`。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number 要向上舍入的值
     * @param {number} [precision=0] 精度
     * @returns {number}返回向上舍入的结果
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * 根据 `precision` 向下保留 `number`。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number 要向下保留的数
     * @param {number} [precision=0] 精度
     * @returns {number} 返回向下保留的结果
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * 计算 `array` 中最大的值。
     * 如果 `array` 是 空的或者假值将会返回 undefined。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要计算的数组
     * @returns {*} 返回最大的值
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max (array) {
      return (array && array.length)
        ? baseExtremum(array, identity, gt)
        : undefined;
    }

    /**
     * 这个方法类似 `_.max` 
     * 除了它接受 `iteratee` 调用每一个元素，根据返回的 value 决定排序准则。 
     * iteratee 会传入1个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要遍历的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {*} 返回最大值
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.maxBy(users, function(o) { return o.age; });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // 使用了 `_.property` 的回调结果
     * _.maxBy(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    function maxBy (array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), gt)
        : undefined;
    }

    /**
     * 计算 `array` 的平均值。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要遍历的数组
     * @returns {number} 返回平均值
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean (array) {
      return sum(array) / (array ? array.length : 0);
    }

    /**
     * 计算 array 中最小的值。 如果 array 是 空的或者假值将会返回 undefined。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要计算的数组
     * @returns {*} 返回最小值
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min (array) {
      return (array && array.length)
        ? baseExtremum(array, identity, lt)
        : undefined;
    }

    /**
     * 这个方法类似 `_.min`。
     * 除了它接受 iteratee 调用每一个元素，根据返回的 value 决定排序准则。 iteratee 会传入1个参数：(value)。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要遍历的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {*} 返回最小值
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.minBy(users, function(o) { return o.age; });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // 使用了 `_.property` 的回调结果
     * _.minBy(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    function minBy (array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), lt)
        : undefined;
    }

    /**
     * 根据 precision 四舍五入 number。
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} number 要四舍五入的值
     * @param {number} [precision=0] 精度
     * @returns {number}返回四舍五入的结果
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * 两双相减
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} minuend 相减的第一个数
     * @param {number} subtrahend 相减的第二个数
     * @returns {number}返回结果
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    function subtract (minuend, subtrahend) {
      var result;
      if (minuend !== undefined) {
        result = minuend;
      }
      if (subtrahend !== undefined) {
        result = result === undefined ? subtrahend : (result - subtrahend);
      }
      return result;
    }

    /**
     * 计算 `array` 中值的总和
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要遍历的数组
     * @returns {number} 返回总和
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum (array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : undefined;
    }

    /**
     * 这个方法类似 `_.sum`。
     * 除了它接受 iteratee 调用每一个元素，根据返回的 value 决定如何计算。 
     * iteratee 会传入1个参数：(value)。
     * 
     * @static
     * @memberOf _
     * @category Math
     * @param {Array} array 要遍历的数组
     * @param {Function|Object|string} [iteratee=_.identity] 这个函数会处理每一个元素
     * @returns {number} 返回总和
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // 使用了 `_.property` 的回调结果
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy (array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee))
        : undefined;
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype             = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype             = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Avoid inheriting from `Object.prototype` when possible.
    Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

    // Add functions to the `MapCache`.
    MapCache.prototype.clear     = mapClear;
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get       = mapGet;
    MapCache.prototype.has       = mapHas;
    MapCache.prototype.set       = mapSet;

    // Add functions to the `SetCache`.
    SetCache.prototype.push = cachePush;

    // Add functions to the `Stack` cache.
    Stack.prototype.clear     = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get       = stackGet;
    Stack.prototype.has       = stackHas;
    Stack.prototype.set       = stackSet;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after            = after;
    lodash.ary              = ary;
    lodash.assign           = assign;
    lodash.assignIn         = assignIn;
    lodash.assignInWith     = assignInWith;
    lodash.assignWith       = assignWith;
    lodash.at               = at;
    lodash.before           = before;
    lodash.bind             = bind;
    lodash.bindAll          = bindAll;
    lodash.bindKey          = bindKey;
    lodash.chain            = chain;
    lodash.chunk            = chunk;
    lodash.compact          = compact;
    lodash.concat           = concat;
    lodash.cond             = cond;
    lodash.conforms         = conforms;
    lodash.constant         = constant;
    lodash.countBy          = countBy;
    lodash.create           = create;
    lodash.curry            = curry;
    lodash.curryRight       = curryRight;
    lodash.debounce         = debounce;
    lodash.defaults         = defaults;
    lodash.defaultsDeep     = defaultsDeep;
    lodash.defer            = defer;
    lodash.delay            = delay;
    lodash.difference       = difference;
    lodash.differenceBy     = differenceBy;
    lodash.differenceWith   = differenceWith;
    lodash.drop             = drop;
    lodash.dropRight        = dropRight;
    lodash.dropRightWhile   = dropRightWhile;
    lodash.dropWhile        = dropWhile;
    lodash.fill             = fill;
    lodash.filter           = filter;
    lodash.flatMap          = flatMap;
    lodash.flatten          = flatten;
    lodash.flattenDeep      = flattenDeep;
    lodash.flip             = flip;
    lodash.flow             = flow;
    lodash.flowRight        = flowRight;
    lodash.fromPairs        = fromPairs;
    lodash.functions        = functions;
    lodash.functionsIn      = functionsIn;
    lodash.groupBy          = groupBy;
    lodash.initial          = initial;
    lodash.intersection     = intersection;
    lodash.intersectionBy   = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert           = invert;
    lodash.invokeMap        = invokeMap;
    lodash.iteratee         = iteratee;
    lodash.keyBy            = keyBy;
    lodash.keys             = keys;
    lodash.keysIn           = keysIn;
    lodash.map              = map;
    lodash.mapKeys          = mapKeys;
    lodash.mapValues        = mapValues;
    lodash.matches          = matches;
    lodash.matchesProperty  = matchesProperty;
    lodash.memoize          = memoize;
    lodash.merge            = merge;
    lodash.mergeWith        = mergeWith;
    lodash.method           = method;
    lodash.methodOf         = methodOf;
    lodash.mixin            = mixin;
    lodash.negate           = negate;
    lodash.nthArg           = nthArg;
    lodash.omit             = omit;
    lodash.omitBy           = omitBy;
    lodash.once             = once;
    lodash.orderBy          = orderBy;
    lodash.over             = over;
    lodash.overArgs         = overArgs;
    lodash.overEvery        = overEvery;
    lodash.overSome         = overSome;
    lodash.partial          = partial;
    lodash.partialRight     = partialRight;
    lodash.partition        = partition;
    lodash.pick             = pick;
    lodash.pickBy           = pickBy;
    lodash.property         = property;
    lodash.propertyOf       = propertyOf;
    lodash.pull             = pull;
    lodash.pullAll          = pullAll;
    lodash.pullAllBy        = pullAllBy;
    lodash.pullAt           = pullAt;
    lodash.range            = range;
    lodash.rangeRight       = rangeRight;
    lodash.rearg            = rearg;
    lodash.reject           = reject;
    lodash.remove           = remove;
    lodash.rest             = rest;
    lodash.reverse          = reverse;
    lodash.sampleSize       = sampleSize;
    lodash.set              = set;
    lodash.setWith          = setWith;
    lodash.shuffle          = shuffle;
    lodash.slice            = slice;
    lodash.sortBy           = sortBy;
    lodash.sortedUniq       = sortedUniq;
    lodash.sortedUniqBy     = sortedUniqBy;
    lodash.split            = split;
    lodash.spread           = spread;
    lodash.tail             = tail;
    lodash.take             = take;
    lodash.takeRight        = takeRight;
    lodash.takeRightWhile   = takeRightWhile;
    lodash.takeWhile        = takeWhile;
    lodash.tap              = tap;
    lodash.throttle         = throttle;
    lodash.thru             = thru;
    lodash.toArray          = toArray;
    lodash.toPairs          = toPairs;
    lodash.toPairsIn        = toPairsIn;
    lodash.toPath           = toPath;
    lodash.toPlainObject    = toPlainObject;
    lodash.transform        = transform;
    lodash.unary            = unary;
    lodash.union            = union;
    lodash.unionBy          = unionBy;
    lodash.unionWith        = unionWith;
    lodash.uniq             = uniq;
    lodash.uniqBy           = uniqBy;
    lodash.uniqWith         = uniqWith;
    lodash.unset            = unset;
    lodash.unzip            = unzip;
    lodash.unzipWith        = unzipWith;
    lodash.values           = values;
    lodash.valuesIn         = valuesIn;
    lodash.without          = without;
    lodash.words            = words;
    lodash.wrap             = wrap;
    lodash.xor              = xor;
    lodash.xorBy            = xorBy;
    lodash.xorWith          = xorWith;
    lodash.zip              = zip;
    lodash.zipObject        = zipObject;
    lodash.zipWith          = zipWith;

    // Add aliases.
    lodash.each       = forEach;
    lodash.eachRight  = forEachRight;
    lodash.extend     = assignIn;
    lodash.extendWith = assignInWith;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add               = add;
    lodash.attempt           = attempt;
    lodash.camelCase         = camelCase;
    lodash.capitalize        = capitalize;
    lodash.ceil              = ceil;
    lodash.clamp             = clamp;
    lodash.clone             = clone;
    lodash.cloneDeep         = cloneDeep;
    lodash.cloneDeepWith     = cloneDeepWith;
    lodash.cloneWith         = cloneWith;
    lodash.deburr            = deburr;
    lodash.endsWith          = endsWith;
    lodash.eq                = eq;
    lodash.escape            = escape;
    lodash.escapeRegExp      = escapeRegExp;
    lodash.every             = every;
    lodash.find              = find;
    lodash.findIndex         = findIndex;
    lodash.findKey           = findKey;
    lodash.findLast          = findLast;
    lodash.findLastIndex     = findLastIndex;
    lodash.findLastKey       = findLastKey;
    lodash.floor             = floor;
    lodash.forEach           = forEach;
    lodash.forEachRight      = forEachRight;
    lodash.forIn             = forIn;
    lodash.forInRight        = forInRight;
    lodash.forOwn            = forOwn;
    lodash.forOwnRight       = forOwnRight;
    lodash.get               = get;
    lodash.gt                = gt;
    lodash.gte               = gte;
    lodash.has               = has;
    lodash.hasIn             = hasIn;
    lodash.head              = head;
    lodash.identity          = identity;
    lodash.includes          = includes;
    lodash.indexOf           = indexOf;
    lodash.inRange           = inRange;
    lodash.invoke            = invoke;
    lodash.isArguments       = isArguments;
    lodash.isArray           = isArray;
    lodash.isArrayLike       = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean         = isBoolean;
    lodash.isDate            = isDate;
    lodash.isElement         = isElement;
    lodash.isEmpty           = isEmpty;
    lodash.isEqual           = isEqual;
    lodash.isEqualWith       = isEqualWith;
    lodash.isError           = isError;
    lodash.isFinite          = isFinite;
    lodash.isFunction        = isFunction;
    lodash.isInteger         = isInteger;
    lodash.isLength          = isLength;
    lodash.isMatch           = isMatch;
    lodash.isMatchWith       = isMatchWith;
    lodash.isNaN             = isNaN;
    lodash.isNative          = isNative;
    lodash.isNil             = isNil;
    lodash.isNull            = isNull;
    lodash.isNumber          = isNumber;
    lodash.isObject          = isObject;
    lodash.isObjectLike      = isObjectLike;
    lodash.isPlainObject     = isPlainObject;
    lodash.isRegExp          = isRegExp;
    lodash.isSafeInteger     = isSafeInteger;
    lodash.isString          = isString;
    lodash.isSymbol          = isSymbol;
    lodash.isTypedArray      = isTypedArray;
    lodash.isUndefined       = isUndefined;
    lodash.join              = join;
    lodash.kebabCase         = kebabCase;
    lodash.last              = last;
    lodash.lastIndexOf       = lastIndexOf;
    lodash.lowerCase         = lowerCase;
    lodash.lowerFirst        = lowerFirst;
    lodash.lt                = lt;
    lodash.lte               = lte;
    lodash.max               = max;
    lodash.maxBy             = maxBy;
    lodash.mean              = mean;
    lodash.min               = min;
    lodash.minBy             = minBy;
    lodash.noConflict        = noConflict;
    lodash.noop              = noop;
    lodash.now               = now;
    lodash.pad               = pad;
    lodash.padEnd            = padEnd;
    lodash.padStart          = padStart;
    lodash.parseInt          = parseInt;
    lodash._baseRandom       = baseRandom;
    lodash.random            = random;
    lodash.reduce            = reduce;
    lodash.reduceRight       = reduceRight;
    lodash.repeat            = repeat;
    lodash.replace           = replace;
    lodash.result            = result;
    lodash.round             = round;
    lodash.runInContext      = runInContext;
    lodash.sample            = sample;
    lodash.size              = size;
    lodash.snakeCase         = snakeCase;
    lodash.some              = some;
    lodash.sortedIndex       = sortedIndex;
    lodash.sortedIndexBy     = sortedIndexBy;
    lodash.sortedIndexOf     = sortedIndexOf;
    lodash.sortedLastIndex   = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase         = startCase;
    lodash.startsWith        = startsWith;
    lodash.subtract          = subtract;
    lodash.sum               = sum;
    lodash.sumBy             = sumBy;
    lodash.template          = template;
    lodash.times             = times;
    lodash.toInteger         = toInteger;
    lodash.toLength          = toLength;
    lodash.toLower           = toLower;
    lodash.toNumber          = toNumber;
    lodash.toSafeInteger     = toSafeInteger;
    lodash.toString          = toString;
    lodash.toUpper           = toUpper;
    lodash.trim              = trim;
    lodash.trimEnd           = trimEnd;
    lodash.trimStart         = trimStart;
    lodash.truncate          = truncate;
    lodash.unescape          = unescape;
    lodash.uniqueId          = uniqueId;
    lodash.upperCase         = upperCase;
    lodash.upperFirst        = upperFirst;

    // Add aliases.
    lodash.first = head;

    mixin(lodash, (function () {
      var source = {};
      baseForOwn(lodash, function (func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), {'chain': false});

    /*------------------------------------------------------------------------*/

    /**
     * 语义化版本号
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function (methodName, index) {
      LazyWrapper.prototype[methodName] = function (n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({'size': nativeMin(n, MAX_ARRAY_LENGTH), 'type': methodName + (result.__dir__ < 0 ? 'Right' : '')});
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function (n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function (methodName, index) {
      var type     = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function (iteratee) {
        var result = this.clone();
        result.__iteratees__.push({'iteratee': getIteratee(iteratee, 3), 'type': type});
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function (methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function () {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function (methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function () {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function () {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function (predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function (predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = rest(function (path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function (value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function (predicate) {
      predicate = getIteratee(predicate, 3);
      return this.filter(function (value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function (start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end    = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function (predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function () {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function (func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker       = /^(?:head|last)$/.test(methodName),
          lodashFunc    = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped  = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function () {
        var value    = this.__wrapped__,
            args     = isTaker ? [1] : arguments,
            isLazy   = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy  = isLazy || isArray(value);

        var interceptor = function (value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll    = this.__chain__,
            isHybrid    = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy    = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value      = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({'func': thru, 'args': [interceptor], 'thisArg': undefined});
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (methodName) {
      var func         = arrayProto[methodName],
          chainName    = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function () {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function (value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function (func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key   = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({'name': methodName, 'func': lodashFunc});
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{'name': 'wrapper', 'func': undefined}];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone   = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value   = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.at      = wrapperAt;
    lodash.prototype.chain   = wrapperChain;
    lodash.prototype.commit  = wrapperCommit;
    lodash.prototype.flatMap = wrapperFlatMap;
    lodash.prototype.next    = wrapperNext;
    lodash.prototype.plant   = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.run     = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    if (iteratorSymbol) {
      lodash.prototype[iteratorSymbol] = wrapperToIterator;
    }
    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Expose lodash on the free variable `window` or `self` when available. This
  // prevents errors in cases where lodash is loaded by a script tag in the presence
  // of an AMD loader. See http://requirejs.org/docs/errors.html#mismatch 了解详情
  (freeWindow || freeSelf || {})._ = _;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function () {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));
