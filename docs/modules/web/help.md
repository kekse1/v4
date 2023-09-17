<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# Help via Popup..
BTW., needed to rename them to **`help`**, since (at least) Chrome got it's own
_experimental_ popup support, so I avoided name collisions.

## Events
It's working via `pointermove`, `pointerover`, and `pointerout`, but not [only]
with regular `_event.target` check, but by looking up any `document.elementsFromPoint()`.
This ensures that also nested elements won't override any higher popup/help definition,
and some more advantages.

## Elements
Either defined by a String in the `Node`-**Attribute**, or either as String or another
real `Node` in the `(Node).help` member.

## Mobile
Won't be shown in `mobile` view neither with a pointer(-type) which isn't a `mouse`.

## `Freeze` support
.. is also done! Look at `freeze.js` (also TODO in this documentation). Here it was
neccessary to e.g. select popup text/html without closing or moving this help, etc.

## More/..
.. still TODO _in this documentation_. My real progress is more than documentated in here.

