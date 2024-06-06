<img src="https://kekse.biz/github.php?draw&text=`animation`&override=github:v4" />

# Web Animations API
There are some problems with the native implementation. So I implemented some more logics,
inclusive features for better animation handling. All totally managed!

All my extensions are implemented straight into the `Animation(.prototype)` object (and,
of course, the `HTMLElement.prototype.animate`), so you don't need to remember/care about
other functions or smth.

And [here's the **source code**](/js/web/animation.js)!

## General thoughts
This documentation element is still TODO..!!

I just wanted to say that even with **un**-managed animations, keyframes can contain the
value `null`, which will be replaced by the current element's real style (from `getComputedStyle()`).

Additionally, you can use `{ managed: true/false/null }` to alter the behavior, etc.. `null` is the
least possible option, so nearly nothing will be done furthermore. These animation won't even get
collected by `document.realAnimations[]`..

//TODO/..

## Functionality
Since I'm combining some animated styles sometimes, and because I nevertheless want to
replace (or smth.) parts of this styles, I'm first splitting up every animation (if it's
a `.managed` one) in it's own styles (by checking the keyframes object/array).

This way I can handle them each. To make things easier, I've also implemented the new
**`ManagedAnimation`** class, which is essential for any (`.managed`) animation, etc..

**I'm going to explain more l8rs.. so this whole module documentation is still TODO.**

## Classes
* **`ManagedAnimation`**, as described in here, somewhere.
* **`GradientAnimation`**

The `GradientAnimation` animates the `wallpaper` of `HTMLElement`, but with**out** the
'Web Animations API'. It uses `requestAnimationFrame` and some `Math.psin()`, etc..

> **Note**
> **`Math.psin()`** is my own version which uses `Math.sin()`, but converts the results
> to be only **positive** values. JFYI: **`((Math.sin(...) + 1) / 2)`**..

## Events
The bold ones are my own, new event types. Respective callbacks (w/ `.type`), since they
are defined in the `_options` object, with these names (mapping to a `Function`):

* `finish`
* `cancel`
* `remove`
* **`callback`**
* **`relay`**
* **`stop`**
* **`error`**

The `callback` event is always fired, after any kind of ending an animation.

The `error` is there as opposite to `finish`, if the animation is changed without finish.

The `relay` event is being emitted when another animation with a style which is already
been animated starts. You should know, that you can use the `{ method: 'set'/'add' }` in
the options object to select the behavior for new vs. old callbacks. It's also the event
which won't emit the `error` event (or should it? Tell me your opinion..).

## Functions
Only managed animations are affected here:

* **`HTMLElement.prototype.animate(_keyframes, _options, ... _args)`**
* `HTMLElement.prototype.show(_options, ... _args)`
* `HTMLElement.prototype.hide(_options, ... _args)`
* `HTMLElement.prototype.fade(_type, _options, ... _args)`
* `HTMLElement.prototype.blink(_options, ... _args)`
* `HTMLElement.prototype.vibrate(_enabled, _speed, _interval, _dots, _default_inner_html, _dot)`
* `HTMLElement.prototype.vibrating`
* `HTMLElement.prototype.wallpaperAnimation(_enabled, _speed, _animation)`
* `HTMLElement.prototype.wallpaper`
* `HTMLElement.prototype.pulse(... _args)`
* `HTMLElement.prototype.toggle(... _args)`
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

I hope this are all.. but I'm not sure (just look for yourself in the `animation.js`).

### Most used ones
These are the most important functions (using my Managed Animations):

* **`HTMLElement.prototype.animate()`**
* `HTMLElement.prototype.show()`
* `HTMLElement.prototype.hide()`

The rest is shown [above](#functions).

> **Warning**
> The current state is that only one of both possible keyframe formats are supported
> (since I've been lazy, just a bit..). But that'll change.

### 'Emergency stop'
The `Animation` object implements the **`.destroy(_func, ... _args)`** function, which
controls **any** active animation - even the **un**managed ones. Use it with a String
as `_func` argument (will call this function in every animation), or use on of these
(used/introduced here for `window.destroy()`, of the `window.stop()`, etc.. see also
the [**`window.js`**](window.md)):

* `Animation.destroy(_func, ... _args)`
* **`Animation.stop(... _args)`**
* **`Animation.cancel(... _args)`**
* **`Animation.finish(... _args)`**
* **`Animation.play(... _args)`**
* **`Animation.pause(... _args)`**

> **Warning**
> Holds for really **every** animation, also all NON-managed ones (uses the
> `document.realAnimations[]` array, jfyi).

> **Note**
> More or less similar to `document.controlAnimation(_func, ... _args)`..

## For your info..
There's a `--speed` CSS Custom Property to change the whole acceleration of
any animation. If disabled (setting to `0`), any animation will only set the
CSS styles to the target values. But the optional `delay` will be enforced..

Additionally, there's the (only global!) `--global` for more global adaption.

### Using the `AbortController`
Both animation types (whether managed or not) do support the `AbortController` (native
JavaScript), you just need to put a `{ signal }` into the `_options`. The type of stopping
animations this way is configurable in the [`config.css`](../../../css/config.css) (see `--abort-method`), and this
will also hold if not specified as the reason for the `.abort()` (so [ `stop`, `cancel`, `finish`, .. ]).

## Attributes
These are two possible modifier attributes (of the `HTMLElement`s).

* **noanim**
* **ignanim**

The first one will enforce the animations target styles without animating them,
and will also call the callbacks, etc.

The second one will just `return false` when trying to `.animate()` these elements.

## Other functions
I think there are more functions which could be handy for you and your animations.
At the moment I'm just pointing to this first one, since I'm currently working on it:

* `Animation.extractAxes(_value, _fallback = DEFAULT_AXES)`

If the `_value` argument ain't correct (neither Array nor String), it'll throw an adequate `Error`,
if - and only if - you (un-)defined the `_fallback` argument to smth. non-valid (so Array or String);
otherwise it'll return the `DEFAULT_AXES` fallback (also in an Array, as usual for this function).

If an empty string or `false` is defined, it'll return an empty array, but if `true` is defined (mostly
in the animation `_options`), it'll use the `DEFAULT_AXES`.

