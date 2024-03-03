<img src="https://kekse.biz/github.php?draw&text=`Help`&override=github:v4" />

# **`class Help`**
BTW., needed to rename them to **`help`**, since (at least) Chrome got it's own
_experimental_ popup support, so I avoided name collisions.

## `EventTarget`
Since the `.related` elements are EventTargets, they'll fire a `help` event both on
`.show()` and `.hide()` (w/ this as the `_event.type` parameter).

## Elements
Either defined by a String in the `Node`-**Attribute**, or either as String or another
real `Node` in the `(Node).help` member. If wished, a fallback to `[href]` is available.

Additionally there's also (again both attrib and member) `.helpText`, so not the `.innerHTML`
but the `.textContent` value will be set in the help box.. sometimes maybe necessary (I'm
using it in the `GitHub` 'index')!

### Hide any higher help
If one of the elements we're looping through encodes an EMPTY string, either as attribute
or as member, higher help definitions will be overridden, so they won't appear then. This
is also an important feature.

### More Attributes and Members
* **class**: More CSS class names to add to the `.classList`
* **style**: Whole CSS style string to **add**.

Both can be defined as (Element) attributes or as instance members. Members are preferred,
at least for this both items. The behavior for [href] and [help] is partially different.

### Clearing
* `Node.prototype.clearHelp(_more = true, _apply = true)`

Delete any defined help on a `Node`. `_more` to also clear styles and classes, and the
`_apply` to also directly close a maybe opened Help element.

## Mobile
Won't be shown in `mobile` view neither with a pointer(-type) which isn't a `mouse`.

## `Freeze` support
.. is also done! Look at `freeze.js` (also TODO in this documentation). Here it was
necessary to e.g. select popup text/html without closing or moving this help, etc.

