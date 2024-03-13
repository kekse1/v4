<img src="https://kekse.biz/github.php?draw&text=`window`&override=github:v4" />

# **`window`**.js
Now w/ extended **`window.stop(...)`**, see also **`error()`** \[TODO in this documentation\].

Additionally, beneath the last implementation, visible here below, I'm going to manage all
`setTimeout()` and `setInterval()`, so e.g. `window.stop()` can also stop any existent one, etc.

## First base
* **`window.isHorizontal`**
* **`window.isVertical`**
* **`window._stop(_callback)`**
* **`window.stop(_message, ... _printf)`**
* **`window.destroy(_callback)`**

`window._stop()` is the extended base function you already might now, while `window.stop(_message)`
is my own version to 'hard stop' everything with an error message.. used also from my `error()`
function, if it's `_options` argument has `{ stop: true/(string) }`.

## _Managed_ timeouts/intervals
Using `window.timeouts` and `window.intervals` you can ask for the amount of such managed items. Asking
for their IDs? Use `window.timeout` or `window.interval`, which return an array with all IDs. And, last
but not least, using `window.getTimeout()` or `window.getInterval()` w/o any argument will return all
managed items with their full object (holding more infos for you and me/us).

And btw: I removed the `_code` parameter from `setTimeout()` and `setInterval()`, so no evil `eval()`
can be utilized here. Additionally, I'm managing both types (timeout vs. interval) separated!! The
official documentation said they're using the same pool normally, I avoided that.

And `clearTimeout()` and `clearInterval()` not only support multiple arguments, they're supporting
also the callback/handler/functions itself, not only the numeric id's (returned by `setTimeout()`
and `setInterval()`).

Using `getTimeout()` and `getInterval()` will either return an array with all available ones, if
NO argument is defined, or just a single or a selection of some (or null if nothing found).

Now also with `has{Timeout,Interval}()`, to check for existing IDs or handler functions. You can
call them with any number of arguments. Without any, the result shows if at least one timeout/interval
is defined. One argument directly returns `true/false` (if not `null`, when none is defined), or many
will return in a result array.

### _Unique_ handler functions
Like it's the way with events, my timeouts/intervals support UNIQUE handler functions.

So if `DEFAULT_UNIQUE` is true, no more timeouts/intervals are being created if a previously defined
handler function is already there.

### Implementation

* `window.timeout`
* `window.timeouts`
* `window.interval`
* `window.intervals`
* `window.setTimeout(_handler, _delay, ... _params)`
* `window.setInterval(_handler, _delay, ... _params)`
* `window.clearTimeout(... _args)`
* `window.clearInterval(... _args)`
* **`window.clearTimeouts()`**
* **`winodw.clearIntervals()`**
* **`window.getTimeout(... _args)`**
* **`window.getInterval(... _args)`**
* **`window.hasTimeout(... _args)`**
* **`window.hasInterval(... _args)`**
