<img src="https://kekse.biz/github.php?draw&text=`Event`&override=github:v4" />

# `EventTarget` and `Event`
This one is extended to manage all events better. Even `.removeAllListeners()` is implemented,
and also `.getEventListener()`, and - of course - the capabilities of regular event functions
are also extended.

Additionally there's a `.emit()` function for easier emitting. etc..

## Implementation
* `EventTarget.prototype.emit(_type, _options, _custom_event)`
* `Event.prototype.stop(_prevent_default, _stop_propagation)`
* `EventTarget.prototype.getEventListener(_type)`
* `EventTarget.prototype.addEventListener(_type, _handler, ... _args)`
* `EventTarget.prototype.removeEventListener(_type, _handler, ... _args)`
* **`EventTarget.prototype.removeAllListeners(_type, ... _args)`**
* `EventTarget.prototype.on(... _args)`
* `EventTarget.prototype.once(_event, _handler, _options, ... _args)`

..
