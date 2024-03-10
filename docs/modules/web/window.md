<img src="https://kekse.biz/github.php?draw&text=`window`&override=github:v4" />

# **`window`**.js
Now w/ extended **`window.stop(_msg)`**, see also **`error()`** \[TODO in this documentation\].

Additionally, beneath the last implementation, visible here below, I'm going to manage all
`setTimeout()` and `setInterval()`, so e.g. `window.stop()` can also stop any existent one, etc.

## First base
* **`window.isHorizontal`**
* **`window.isVertical`**
* **`window._stop()`**
* **`window.stop(_message)`**

`window._stop()` is the extended base function you already might now, while `window.stop(_message)`
is my own version to 'hard stop' everything with an error message.. used also from my `error()`
function, if it's `_options` argument has `{ stop: true/(string) }`.

## Managed timeouts/intervals
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

* `window.timeout`
* `window.timeouts`
* `window.interval`
* `window.intervals`
* `window.setTimeout(_handler, _delay, ... _params)`
* `window.setInterval(_handler, _delay, ... _params)`
* `window.clearTimeout(... _args)`
* `window.clearInterval(... _args)`
* **`window.getTimeout(... _args)`**
* **`window.getInterval(... _args)`**

