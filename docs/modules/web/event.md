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
* **`EventTarget.prototype.countEventListener(_type)`**
* **`EventTarget.prototype.hasEventListener(_type)`**
* **`EventTarget.prototype.emitError(... _args)`**

> [!TIP]
> As usual in this tiny [v4](https://kekse.biz/) documentation, some arguments
> may be optional. Like the `_type` (which results in a global operation which
> treats any event, not only one specific).

### Global scope
Both following are additionally implemented:

* **`window.removeEventListener(_type, _handler, _options)`**
* **`window.removeAllListeners()`**

My intention was that these special extensions are also able to remove event listeners
globally - so for any object with events. Usually such an event emitting object can
only manage it's own events.. these both `window` functions can also (e.g.) receive
an arbitrary Event ID (e.g.!) and remove 'em from any other event emitting object!

## Errors
Additionally (see also [`Error`/Exception](./exception.md)) there's also the following function available:

* **`EventTarget.prototype.emitError(...)`**

This is to really stay event-oriented on the one hand: so one can either catch
`error` events as usual, to handle them in any way. On the other hand: if no such
`error` listener was registered, it'll handle the error as usually any
[`Error`/Exception](./exception.md); so either via my global [`error()`](./exception.md)
function, or (if not defined) it'll `throw` (then use `catch` etc. to handle such error).

See also this function (also listed above):

* **`EventTarget.prototype.emitError(... _args)`**


