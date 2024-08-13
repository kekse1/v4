<img src="https://kekse.biz/github.php?draw&text=`Event`&override=github:v4" />

# `EventTarget` and `Event`
This one is extended to manage all events better. Even `.removeAllListeners()` is implemented,
and also `.getEventListener()`, and - of course - the capabilities of regular event functions
are also extended.

Additionally there's a `.emit()` function for easier emitting. etc.. plus: any `<button>` will
automatically `.toggle()` before it's click handlers are being called (at the half time of the
toggle animation).

## 'Best' feature
I like it the most, that a `.addEventListener()` will return a unique, random ID (string).

This way you can easily remove events later, which was a bit 'ugly' with anonymous functions.

It's also easy to do your own kinda **'Garbage Collection'** by pushing every ID return onto
one (mostly local) array, and iterate through it at your end (e.g. when loading a new page,
see the `load` event of the [`page.js`](page.md)).. you can just use the `window.removeEventListener()`,
since it also allows removing events without having to care to which (EventTarget-)object
this events belong to.

## Implementation
* **`EventTarget.prototype.emit(_type, _options, _custom_event)`**
* **`Event.prototype.stop(_prevent_default, _stop_propagation)`**
* **`EventTarget.prototype.countEventListener(_type)`**
* **`EventTarget.prototype.getEventListener(_type)`**
* `EventTarget.prototype.addEventListener(_type, _handler, ... _args)`
* `EventTarget.prototype.removeEventListener(_type, _handler, ... _args)`
* **`EventTarget.prototype.removeAllListeners()`**
* **`EventTarget.prototype.on(... _args)`**
* **`EventTarget.prototype.once(_event, _handler, _options, ... _args)`**
* **`window.removeEventListener(_type, _handler, _options)`**
* **`window.removeAllListeners()`**

..
