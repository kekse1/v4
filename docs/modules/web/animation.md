<img src="https://kekse.biz/github.php?draw&text=`animation`&override=github:v4" />

# Web Animations API
There are some problems with the native implementation. So I implemented some more logics,
inclusive features for better animation handling. All totally managed!

All my extensions are implemented straight into the `Animation(.prototype)` object (and,
of course, the `HTMLElement.prototype.animate`), so you don't need to remember/care about
other functions or smth.

## Functionality
Since I'm combining some animated styles sometimes, and because I nevertheless want to
replace (or smth.) parts of this styles, I'm first splitting up every animation (if it's
a `.managed` one) in it's own styles (by checking the keyframes object/array).

This way I can handle them each. To make things easier, I've also implemented the new
**`ManagedAnimation`** class, which is essential for any (`.managed`) animation, etc..

**I'm going to explain more l8rs.. so this whole module documentation is still TODO.**

## Events
The bold ones are my own, new event types. Respective callbacks (w/ `.type`), since they
are defined in the `_options` object, with these names (mapping to a `Function`):

* `finish`
* `cancel`
* `remove`
* **`callback`**
* **`relay`**
* **`stop`**

## Functions
Only managed animations are affected here:

* `HTMLElement.prototype.vibrate(_enabled, _speed, _interval, _dots, _default_inner_html, _dot)`
* `HTMLElement.prototype.vibrating`
* `HTMLElement.prototype.wallpaperAnimation(_speed, _animation)`
* `HTMLElement.prototype.wallpaper`
* `HTMLElement.prototype.pulse(... _args)`
* `HTMLElement.prototype.pulseIn(... _args)`
* `HTMLElement.prototype.pulseOut(... _args)`
* `HTMLElement.prototype.fade(_type, _options, ... _args)`
* `HTMLElement.prototype.show(_options, ... _args)`
* `HTMLElement.prototype.hide(_options, ... _args)`
* `HTMLElement.prototype.blink(_options, ... _args)`
* `HTMLElement.prototype.animation`
* `HTMLElement.prototype.animations`
* `HTMLElement.prototype.hasAnimation(... _args)`
* `HTMLElement.prototype.getAnimation(... _args)`
* `HTMLElement.prototype.getAnimations(... _args)`
* `HTMLElement.prototype.controlAnimation(_func, ... _args)`
* `HTMLElement.prototype.stopAnimation(... _args)`
* `HTMLElement.prototype.cancelAnimation(... _args)`
* `HTMLElement.prototype.finishAnimation(... _args)`
* `HTMLElement.prototype.playAnimation(... _args)`
* `HTMLElement.prototype.pauseAnimation(... _args)`
* `document.animation`
* `document.animations`
* `document.getAnimation(... _args)`
* `document.getAnimations(... _args)`
* `document.hasAnimation(... _args)`
* `document.controlAnimation(_func, ... _args)`
* `document.stopAnimation(... _args)`
* `document.cancelAnimation(... _args)`
* `document.finishAnimation(... _args)`
* `document.playAnimation(... _args)`
* `document.pauseAnimation(... _args)`

This function is also an extension of me, but also works in non-managed mode;
it'll stop the animation like `.cancel()`, but will commit the current style
state before. So the animation stopps and it all looks like regular `.pause()`;
BUT the `_event.type` is changed to `stop`!

* `Animation.prototype.stop()`

## For your info..
There's a `--speed` CSS Custom Property to change the whole acceleration of
any animation. If disabled (setting to `0`), any animation will only set the
CSS styles to the target values. But the optional `delay` will be enforced..

Additionally, there's the (only global!) `--global` for more global adaption.

## Attributes
These are two possible modifier attributes (of the `HTMLElement`s).

* **noanim**
* **ignanim**

The first one will enforce the animations target styles without animating them,
and will also call the callbacks, etc.

The second one will just `return false` when trying to `.animate()` these elements.

