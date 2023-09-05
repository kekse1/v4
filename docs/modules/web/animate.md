<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# Web Animations API
There are some problems with the native implementation. So I implemented some more logics,
inclusive features for better animation handling. All totally managed!

All my extensions are implemented straight into the `Animation(.prototype)` object (and,
of course, the `HTMLElement.prototype.animate`), so you don't need to remember/care about
other functions or smth.

> **Note**
> Did you knew? Even if I could implement own animation methods, it's always recommended
> to use the native `Web Animations API`, since it's based on the original browser's
> native implementation (C++ or so), which will act really fast! So you really should
> use the `.animate()` of your HTML elements!

## Managed or not managed
First, if `_options.managed = false`, nothing will change - then it's the default behavior
of the Animation. If left out or set to `true`, the changes described below will be applied.

## First problem: Persistance
Of course you can use `fill = 'forwards'`, but those styles can't be changed afterwards
via regular `.style[]` of your Elements! So I extended it this way, that after any animation
the last state will always be set as new style - and so it stays changeable!

## CSS styles
One 'problem' (more/less) is that CSS styles in the keyframes need to be camel-cased.
I changed this, since I'm converting them to the required camel-cased manually.

The other thing is that I'm also supporting `null` values in the keyframes, which will
be replaced by the element's current style.

## Relaying and the style state
Beneath the new `(Animate).stop()` method, which will cancel the animation and set the
current style state, a new animation with already animated styles will start from the
current style states, so everything is really flowing..

And, of course, for more smoothness any animation will also start with the currently set
style state, since anything else looks bad. AND if you cancel animations, the old state
will be set again, which will persist above animation relays (so the stop and continue
of an animation). This means, every animation relay will hold the old state, so if you
cancel one, not the old state of an relay point but the really original state will be set.

> **Note**
> But don't panic: as already mentioned above, you can omit this behavior with the
> `managed` option (set it to `false` to leave out all my extensions).

The number of relays always stays in the animation object (`.relays`).

### Relaying with less styles
If you continue an animation with less styles in your keyframes than an older animation,
but use a style which is used in this older animations, then the other animations will run
up to their ends, only the newest animation styles will stop and continue (being relayed).

## Scaling
_Some_ animations are being scaled, if you define it in your `_options`, in the `duration`.
But for this you have to set the `_options.scale = true`.

Example given: if you set the width of an element during 10 seconds, and you continue into
the other direction after 5 seconds, then the duration of this new relay will be
multiplicated with 0.5, since the half was already done.

But it's hard to say when this is neccessary (it's not only the style to compare, but also
the direction - and I don't want to split up the style strings itself), it's turned OFF by
default, and will only be applied if you really want it!

For this, btw., every animation holds a `.done` floating value between 0 and 1. It's the
division `currentTime / duration`.

## Callbacks
You can define following callbacks in the `_options` object, which will be called with the
help of my [`CallbackController`](../lib/callback-controller.md). They replace the original
`(Animate).addEventListener()`, since my version is better in many ways.

* `free`: will be called every time (even though relaying), since it's added, not set.
* `relay`: when an animation is being relayed.
* `callback`: will always be called with any of the following events (before them).
* `finish`: regular event.
* `cancel`: regular event.
* `remove`: regular event.

Since im using the [`CallbackController`](../lib/callback-controller.md), I'm replacing the
old callbacks by new ones, using `(CallbackController).set()`. If you want to `.add()` the
new ones, use the `_options.add = true`. Exception: the `free` callback, which will be added,
so you'll get called this way every time (to clean up your memory, etc.).

## Other functions
.. are defined in the `document` object and every `HTMLElement`, to really **manage** 'em:

* `.hasAnimation(... _args)`
* `.getAnimation(... _args)`
* `.controlAnimation(_func, ... _args)`
    * `.stopAnimation(... _args)`
    * `.cancelAnimation(... _args)`
    * `.finishAnimation(... _args)`
    * `.playAnimation(... _args)`

Plus the `document.animations` and `(HTMLElement).animations` which count the amounts!

