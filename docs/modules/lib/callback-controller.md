<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# `class CallbackController extends Map`
Einerseits muss man pruefen, ob eine Funktion bereits laeuft, um sie nicht dabei zu stoeren,
andererseits muss dort je nachdem ein altes Callback abgeloest/ersetzt werden, oder sogar
neue Aufrufe mit Callbacks nach der Arbeit mit aufrufen.

Dazu habe ich mir den `CallbackController` ausgedacht.. mehr Infos nur hier in diesem
Ausschnitt aus meiner `TODO.txt`:

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
