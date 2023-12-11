<img src="https://kekse.biz/github.php?draw&text=`Math`&override=github:v4" />

# `math`.js
Note: Every function in here always returns `(result || 0)`, which should be respected
when extending this file.. The reason is to prevent any `-0` (since JavaScript supports
such negative zero's). I don't like these..

## Implementation
These are my current extensions in this file `lib/globals/math.js`. There's also another math related file
[`lib/globals/math.unit.js`](math.unit.md) with special extensions, but this one is not the topic in here.

### Floating Points values and Integers
* `Math.round(_value, _precision = 0)`
* `Math.floor(_value, _precision = 0)`
* `Math.ceil(_value, _precision = 0)`
* `Math.int(_value, _precision = 0, _inverse = false)`

The first three ones now also support the `_precision` argument. The regular implementation missed it.
But they can be found at the same place, but with a `_` sign before (e.g. `Math._round`).

The `Math.int()` is new, and is a 'workaround' when converting negative floating points to integers..

* `Math.min(... _args)`
* `Math.max(... _args)`

These now support `BigInt` types. Even mixed with regular `Number` values.

* `Math.fraction(_float, _tolerance = 1.0E-6, _radix = 10)`

And this finally returns a string like `3/4` instead of `0.75` or so. :-)

### Randomization
One TODO item is to define `_crypto` argument or configure it some way, so these regular functions
based on `Math.random()` will use the `crypto` module functions - transparently.. but for now only:

* `Math.random.int(_max, _min, _max_inclusive)`
* `Math.random.float(_max, _min, _max_inclusive)`
* `Math.random.byte()`
* `Math.random.bool()`
* `Math.random.string(_length, _alphabet)`

### Circles
Most important ones, either for drawing circles or when animating non-linear (massively used by me):

* `Math.psin(_value)`
* `Math.pcos(_value)`

These ones are _my_ (non-official..) '**positive** sin/cos'. They return only positive results, and
they start at `0` - the same like regular `cos/sin()`, BUT here it's also the beginning of counting,
whereas in regular `cos/sin()` the `0` is the center/middle (since they count between `-1 .. 1` ;-).

* `Math.deg2rad(_degrees)`
* `Math.rad2deg(_degrees)`

Obvious, isn't it?! ;-)

#### More Drawing
* `Math.scale(_value, _max, _min)`

Usefull when manually animating, e.g.. when either `Math.{,p}sin()` or some `(runtime / duration)`
returns a float between `0 .. 1`, this `Math.scale()` will translate it to a value between `_max`
and `_min`.

Example: `Math.scale(0.5, 10, 0)` will return `5`. `Math.scale(0.5, 20, 10)` will return `15`. :-)

### Other Conversions..
Accessing single items in an Array or String, as an example, can be easier with this function:

* `Math.getIndex(_index, _length)`

At first, it'll use the **modulo** operator to make the given `_index` fit into the real `_length`
of an array, etc.. and the second point is to convert **negative** values to positive ones, whereas
`-1` defines the last item (or the `_length - 1`), etc.. so counting backwards.

### Logarithms, etc..
This is the regular `Math.log()`, but with arbitrary `_base` value. Even works with `BigInt` types,
see the locally extending closure `bigIntLogBase()`:

* `Math.logBase(_base, _value)`

### Division, etc..
These ones were used by me for some own `BigNumber` implementation; but they're universal..

* `Math.gcd(_a, _b, _binary)`
* `Math.lcm(_a, _b, _binary)`

.. the `greatest common divisor` and the `least common multiple`.

* `Math.gcd.binary(_a, _b)`
* `Math.gcd.euclidean(_a, _b)`
* `Math.lcm.binary(_a, _b)`
* `Math.lcm.euclidean(_a, _b)`

The binary ones are also called the '**knuth** algorithm', and it's opposite is the 'euclidean' algorithm.

### TODO
...
