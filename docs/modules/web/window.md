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

## Managed timeouts/intervals
Using `window.timeout` and `window.interval` you can ask for the amount of such managed items.
Furthermore.. with the regular ones listed below, they're altered as well!

And btw: I removed the `_code` parameter from `setTimeout()` and `setInterval()`, so no evil `eval()`
can be utilized here. Additionally, I'm managing both types (timeout vs. interval) separated!! The
official documentation said they're using the same pool normally, I avoided that.

And `clearTimeout()` and `clearInterval()` not only support multiple arguments, they're supporting
also the callback/handler/functions itself, not only the numeric id's (returned by `setTimeout()`
and `setInterval()`).

Using `getTimeout()` and `getInterval()` will either return an array with all available ones, if
NO argument is defined, or just a single or a selection of some (or null if nothing found).

* `window.setTimeout(_handler, _delay, ... _params)`
* `window.setInterval(_handler, _delay, ... _params)`
* `window.clearTimeout(... _args)`
* `window.clearInterval(... _args)`
* **`window.getTimeout(... _args)`**
* **`window.getInterval(... _args)`**

