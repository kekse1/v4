<img src="https://kekse.biz/github.php?draw&text=`radix`&override=github:v4" />

# **`radix`**
My own functions for radix/base conversions; like to encode numbers as strings, or parse strings of 'arbitrary' numerical systems.
Here also the reference to my [`alphabet`.js](alphabet.md), which is the counter-part of this extension(s).

## Reasons
At first, JavaScript can only handle radix between 2 and 36. I extended it up to 62 and even to binary code until radix 256; but
also allowing strings with your own alphabets.

Other reason is that the `BigInt` got no native possibility to parse numbers other than radix 10. And those ones got even more
potential since they can hold really big numbers..

One reason was also my interest in this, so the code of numbers. I also learned about this for my own `Field` structure, and
much more.

## Alphabets
My own alphabets can be found in this `radix.js` file (with own `alphabet` object). But as already said, you can use any..

If you define a number as radix, you can also negate it to a negative value, so the resulting alphabets (see `isRadix()` and
`getAlphabet()`) are being reversed.

In a 'Stellenwertsystem' (englisch translation could be 'place-value system' or 'positional number system' or 'positional notation'?)
you absolutely need at least two symbols (that's the **binary** system, with bits - '**b**inary **d**igit'), but I'm also using both
`0` and `1` as radix which use an alphabet with only letters, no numbers. One with all letters in one-case or lower-case, the other
with both combined. As usual, you can also define -1 or -2 for these both reversed, and -3 would be the binary system in reverse form.

## Implementation
On the one hand there is my base implementation in the `radix.js` file. On the other, there are my overrides of regular JavaScript
functions, so they support my extended version.

Some other code is located in the `globals/numeric.js`, which fits better in there. And, of course, the [`alphabet`.js](alphabet.md),
worth a look..

Additionally, some native functions like `isNaN()` are also being overridden by me. For example the one mentioned here, which can
be very important (is also used for BigInt, since there is no limit in the length of the number strings), is changed to also return
true if string is empty. Etc.. just look in those both files.

### Supported radix and alphabets
To check if a radix (integer) or alphabet (string) is being supported or valid, use the `.isRadix()`. Also there:

* `.toPositive()`
* `.toNegative()`

Then there's the important `.getAlphabet()` function, to get you a string from either these radix integers or alphabet strings (where
multiple occurencies of chars will be removed, etc.). The `alphabet` object also holds the alphabet strings itself, and an array to
count them up (`alphabet.binary`, which is not pre-set, is not listed there).

### Base functions
* **`radix.parse(_string, _radix, _bigint, _float, _throw)`**
* **`radix.render(_value, _radix, _bigint_suffix, _float, _throw)`**

The `_throw` argument (using `DEFAULT_THROW`, also see below) is there to either throw an Exception if something went wrong, or my
preferred form is to return `(null)` in case of any error (or even `(undefined)` if the radix/alphabet was wrong).

> **Note**
> There's the `radix.checkSigns()` function to interprete all preceding `-` and `+` signs.
> Unlike JavaScript itself it supports multiple ones!

### More numerical algorithms
.. look at the [`globals/numeric`](globals/numeric.md).

#### Negative numbers in strings
These `-` and `+` can be any length in the beginning of a numeric string value, which is also my own extension. So the code will
sum up the `-` to count if a number is negative or not (and the `+` are ignored, or also removed from the string).

* `.checkSigns(_string)`: This will return if the resulting number will be negative, the prepared string, as array: [ negative, string ];

## (TODO)
(so more description, etc.)

