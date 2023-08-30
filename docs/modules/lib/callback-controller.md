<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# `extends Map`
Einerseits muss man pruefen, ob eine Funktion bereits laeuft, um sie nicht dabei zu stoeren,
andererseits muss dort je nachdem ein altes Callback abgeloest/ersetzt werden, oder sogar
neue Aufrufe mit Callbacks nach der Arbeit mit aufrufen.

## Usage
We're using the map **keys** for some kind of context, so we can use a `CallbackController` instance
right before the functions which need it. So we manage by e.g. `HTMLElement` instances, when we use
this feature in a `HTMLElement.prototype` function. This way we avoid state variables in the instances.

> **Note**
> I'd recommend you to make your instances more/less 'public', like `Node.prototype.clear.callbackController`.

Additionally, managing callbacks also means that we can add or replace callbacks dynamically on every
call, where the functions relate to this lists. This was neccessary here e.g. when the user interaction
changes smth. that's already running (like an animation or a HTTP load process) and when the old callback
call needed to be _replaced_, ... you understand me? hm. _see the 'My original comment..' section at the end!

> **Note**
> You could also use this one in all your instances, then the key could be your function names, e.g..
> both ways (and more) are possible..

## Transfer
Here I'm replacing animations, to direct to another target style, e.g., without that original callbacks will
be called, up until the newest (relay-)animation is finished or smth.

So for this I'm using (beneath `.get()`) the `.clear()` for all `_type`s, and after handling the animation
shit I only need to `.all()` (or `.set()` vs. `.add()` w/ `Object`) all the old callbacks. etc..

## 'Singleton' styles
As either `.count()` (w/o `_type` string) or even directly `.set()` and `.add()` return the number of previously
defined (until `.clear()`) callbacks (totally, not for a sub-`_type`!), you can see this way if the function is
already running or not. **Very important feature** if you want to avoid multiple actions, so you'll return if
the function is already running! .. maybe you think about simple bool-state-variables? Then you maybe had to
pollute the instances environments, if it's not globally but per-instance. AND it's more easy this way, too.

Another example is a drawing routine, or smth. else which also works async, like also with the `Web Animation API`, etc.
It's really useful, not only as indicator, also to partially replace or append callbacks to be called after or within
the functions.

## Implementation
* `.add(_element, _type, ... _args)`
* `.call(_element, _type, ... _args)`
* `.clear(_element)`
* `.context(_element, _type, _context, ... _args)`
* `.count(_element, _type)`
* `.get(_element, _type)`
* `.all(_element, _object, _merge, ... _args)`
* `.regular(_element, _type, ... _args)`
* `.remove(_element, _type, ... _args)`
* `.reset()`
* `.set(_element, _type, ... _args)`

## TODO
The `.sync` will **maybe** be used to synchronize the callbacks with real **events** (therefore there's the
`static withEventFeature()` function, to check if the key implements `EventTarget` or `EventEmitter`.

## My original comment, describing the 'problem'
.. dazu habe ich mir den `CallbackController` ausgedacht.. mehr Infos nur hier in diesem Ausschnitt aus meiner `TODO.txt`:
```
	@ toc.clear(), und eig. überall wo callbacks, '.isWorking'-status o.ae..

		# frage wäre nur, ob callbacks überschreiben oder addieren...

			# überschreiben? dann *wirklich*!? also callback-uebergabe @ hoehere instanz/variable/.. statt func-parameter nutzen

		# da fehlt ein höheres konzept...?!

			# ganz abstrakt implementiert..!?!

				# wie .registerCallback(func, ctx, cb); O.Ä.!!?

		# suche nach allen 'callback'.. ergaenze folgendes:

!!!!!!		# statt ~'.isClearing' etc. eher ein lokales 'Set' fuer jew. instanzen!? ^_^

!!!!!!			# .. so von wegen: wenn bereits in arbeit, darf nicht zwischendurch neu angefangen o.ae...

!!!!!!			# und 'Map' zur verwaltung von callbacks! ^_^

!!!!!!				# eigene 'extends Map' class, um .add(callback) - dass gleich ein array[] im wert, etc.!

!!!!!!					# falls alter callbacks abgeloest werden sollen, einfach .set(cb) waehlen, statt .add()

!!!!!!						# wenn's keine 'function' ist, entsprechen einfach (ohne fehler!!!) nicht durchlassen.

!!!!!!					# "class 'CallbackController" @ js/lib/.. ^_^

!!!!!!						# die keys sind die contexts/instanzen/ oder eben nur funktionen selbst, falls 'global'.. ;-)

!!!!!!				# bedenke: falls der jew. key gesetzt ist, ist das wie '(instance).isWorking' o.ae.. also abbruch evtl.!

!!!!!!					# je nachdem einfach .add() w/ true/false rueckgabe, und entsprechend evtl. sofort return;

!!!!!!				# und wenn arbeit fertig, einfach '.call(key, ... _a)' zum einfachen aufruf aller cb's, mit .clear() danach! :)~

!!!!!!				# und bei .add()/.set() *optional* als ersten string-parameter den callback-type.. z.b. 'finish', 'cancel', ...!!! :)~
				
!!!!!!					# bestenfalls dadurch in die ..._callbacks jeweils als [type] eingesetzt, und bei .call() evtl. gefiltert! ^_^
```
