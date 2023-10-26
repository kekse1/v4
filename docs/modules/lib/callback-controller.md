<img src="https://kekse.biz/github.php?draw&text=`CallbackController`&override=github:v4" />

# `CallbackController`

## `extends Map`
Einerseits muss man pruefen, ob eine Funktion bereits laeuft, um sie nicht dabei zu stoeren,
andererseits muss dort je nachdem ein altes Callback abgeloest/ersetzt werden, oder sogar
neue Aufrufe mit Callbacks nach der Arbeit mit aufrufen.

### Usage
We're using the map **keys** for some kind of context, so we can use a `CallbackController` instance
right before the functions which need it. So we manage by e.g. `HTMLElement` instances, when we use
this feature in a `HTMLElement.prototype` function. This way we avoid state variables in the instances.

> **Note**
> I'd recommend you to make your instances more/less 'public', like `Node.prototype.clear.callbackController`.

> **Warning**
> **UPDATE**! For better ressource management there's the _static_ `CallbackController.get(_string_key)` now,
> which depends on a single, static `CallbackControllerCarrier` (whereas all it's members are also as static
> versions in the `CallbackController` class). This way we're avoiding unnecessary instances (while the
> Carrier also takes care of deleting unused controllers).

Additionally, managing callbacks also means that we can add or replace callbacks dynamically on every
call, where the functions relate to this lists. This was necessary here e.g. when the user interaction
changes smth. that's already running (like an animation or a HTTP load process) and when the old callback
call needed to be _replaced_, ... you understand me? hm. _see the 'My original comment..' section at the end!

> **Note**
> You could also use this one in all your instances, then the key could be your function names, e.g..
> both ways (and more) are possible..

### Transfer
Here I'm replacing animations, to direct to another target style, e.g., without that original callbacks will
be called, up until the newest (relay-)animation is finished or smth.

So for this I'm using (beneath `.get()`) the `.clear()` for all `_type`s, and after handling the animation
shit I only need to `.all()` (or `.set()` vs. `.add()` w/ `Object`) all the old callbacks. etc..

### 'Singleton' styles
As either `.count()` (w/o `_type` string) or even directly `.set()` and `.add()` return the number of previously
defined (until `.clear()`) callbacks (totally, not for a sub-`_type`!), you can see this way if the function is
already running or not. **Very important feature** if you want to avoid multiple actions, so you'll return if
the function is already running! .. maybe you think about simple bool-state-variables? Then you maybe had to
pollute the instances environments, if it's not globally but per-instance. AND it's more easy this way, too.

Another example is a drawing routine, or smth. else which also works async, like also with the `Web Animation API`, etc.
It's really useful, not only as indicator, also to partially replace or append callbacks to be called after or within
the functions.

### Implementation
**Bold** entries are the important ones:

* **`.add(_element, _type, ... _args)`**
* **`.call(_element, _type, ... _args)`**
* `.carrier`
* `.carrierKey`
* **`.clear(_element, _type, _free_carrier)`**
* `.context(_element, _type, _context, ... _args)`
* `.count(_element, _type)`
* `.delete(... _args)`
* **`.get(_element, _type)`**
* `.has(_element, _type)`
* `.all(_element, _object, _merge, ... _args)`
* `.regular(_element, _type, ... _args)`
* **`.remove(_element, _type, ... _args)`**
* `.reset()`
* **`.set(_element, _type, ... _args)`**
* `.setCarrier(_carrier, _carrier_key)`
* `.checkForCarrierDeletion(_confirm)`
* `.checkIsDestroyed(_error)`
* `.destroy()`

## `CallbackControllerCarrier`
This is even newer. I'm using it in my `animate()` function (see `web/animate.js`), as every animation is identified
by it's **`_type`**.

It's synchronized with it's `CallbackController` instances (since the `CallbackController` accepts one Carrier as
constructor argument).

### Implementation
* `.set(_key, _controller, _overwrite)`
* `.clear(_destroy)`
* `.delete(... _args)`
* `.get(_key, _create)`
* `.has(_key)`
* `.keys`
* `.size`

### Static instance
As mentioned somewhere above, the `CallbackController` got it's own static instance of this `CallbackControllerCarrier`,
to avoid unnecessary resources (of many Controller instances).

All necessary static members are a relay to a static `CallbackController` instance,

And btw., this Carrier also free's up the memory by destroying all unused Controller instances (see `DEFAULT_FREE_CARRIER`).

### Skip freeing carrier
Destroying the `CallbackController` instances (so freeing memory) is the default, if `DEFAULT_FREE_CARRIER` is enabled.
If you want to skip this step while using the `CallbackController`, you can define a `Boolean` in these functions:

* `.clear(_element, _type = null, _free_carrier = DEFAULT_FREE_CARRIER)`
* `.delete(... _args)`

This is useful e.g. if you're clearing a controller instance but want to use it also after this. It's not often this case,
but if this feature wouldn't be, you'd to request the controller twice from your `CallbackControllerCarrier` .. if it's
used at all! If not, you don't need to care, but if so, the problem is that future requests to the carrier wouldn't give
you back the same controller instance - so you wouldn't get your callbacks back again!

###### TODO...
//TODO/..

