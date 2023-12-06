<img src="https://kekse.biz/github.php?draw&text=`Numeric`&override=github:v4" />

# `numeric`.js
.. w/ `Number`, `BigInt` and shared extensions.

## Most important ones, maybe..
These seem to be the most important functions:

* `Number.isNumber(... _args)`
* `Number.isInt(... _args)`
* `Number.isFloat(... _args)`

They expect an arbitrary number of items and will only return true,
if all are real numbers, not Infinity nor NaN! .. BUT: they do only
work with real numbers, not Strings. This case is covered by all the
following functions (all in the `global` namespace!):

* `isNumber(_item, _radix)`
* `isInt(_item, _radix)`
* `isFloat(_item, _radix)`
* `isBigInt(_item, _radix)`
* `isNumeric(_item, _radix)`

If you define a `_radix` (and only in this case!), it'll also check if such numeric values
are encoded in the strings - if such is specified. Otherwise, if `typeof === 'number'`, it'll
use the functions above (in the `Number` namespace).

> **Note**
> The string-ones only work with the help of my [`radix.js`](../radix.md), btw.

### **`isNaN()`**
This (global namespace only, not the `Number` one!) is extending the regular
`isNaN()` function: it 'parses' all (possible) preceding `-` and `+`, and it
returns `true` if the given **string** argument is zero-length..!

## /(TODO)/
...
