<img src="https://kekse.biz/github.php?draw&text=`Math.unit`&override=github:v4" />

# `math.unit`.js
Special functions (etc.) for handling **SIZE**s, **TIME**s and **UNIT**s.

## Implementation

### Time
* `Math.time(_value, _int, _absolute, _relative)`

* `Math.time.absolute(_value, _int)`
* `Math.time.relative(_value, _int)`

* `Math.time.render(_value, _sep, _space, _short, _none, _html, _ms)`
* `Math.time.render.long(_value, _sep, _space, _none, _html, _ms)`
* `Math.time.render.short(_value, _sep, _space, _none, _html, _ms)`

### Size
* `Math.size.base`

* `Math.size(_value, _int, _base, _absolute, _relative, _relative_float)`
* `Math.size.absolute(_size, _int, _base)`
* `Math.size.relative(_size, _int, _base)`

If `_unit` is no valid unit string (see the next function `.findUnit()` here, below) in the following
two functions, the best one will be automatically determined!

* `Math.size.parse(_value, _unit, _base, _bigint, _throw)`
* `Math.size.render(_value, _unit, _precision, _base, _long, _throw)`

The result of the `.render()` function is an array with some infos, and you should do a `.toString()` on it
to get the real size string; so, as an example here: `Math.size.render(1024*1024*1024*512)` => `[ 512, 'GiB', 549755813888 ]`;
`..toString() => '512 GiB'`.

* `Math.size.findUnit(_unit, _throw)`

Some possible/valid `_unit` string examples:

* `m` => `MB`
* `mib` => `MiB`
* `b` => `B`
* `yi` => `YiB`

### Unit
Mainly used by the `String.unit()` function.

* `Math.unit`

.. is the base object, which contains some functions, etc.

## Global namespace
These three base elements are also exported into the `global` namespace (which is `window` in `BROWSER` mode):

* `time`
* `size`
* `unit`
