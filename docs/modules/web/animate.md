<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

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

I'm going to explain more l8rs.. so this whole module documentation is still TODO.

## Events
The bold ones are my own, new event types. They all are based on the `AnimationEvent`.

* `finish`
* `cancel`
* `remove`
* **`relay`**
* **`stop`**

## TODO
...

