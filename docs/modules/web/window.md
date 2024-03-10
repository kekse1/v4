<img src="https://kekse.biz/github.php?draw&text=`window`&override=github:v4" />

# **`window`**.js
Now w/ extended **`window.stop(_msg)`**, see also **`error()`** \[TODO in this documentation\].

Additionally, beneath the last implementation, visible here below, I'm going to manage all
`setTimeout()` and `setInterval()`, so e.g. `window.stop()` can also stop any existent one.

## Current implementation
This is without the planned extension described above, simply atm:

* **`window.isHorizontal`**
* **`window.isVertical`**
* **`window.\_stop()`**
* **`window.stop(_message)`**

