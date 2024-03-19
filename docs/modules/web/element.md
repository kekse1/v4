<img src="https://kekse.biz/github.php?draw&text=`Element`&override=github:v4" />

# **`element.js`**
Extends the **`HTMLElement`** in most times, partially also the **`Node`** or the **`Element`**.

## Implementation
This is the current state - it may change in some time (or rather: will be extended!).

* `HTMLElement.prototype.borderWidth`
* `HTMLElement.prototype.borderHeight`
* `HTMLElement.prototype.scrollbarHeight`
* `HTMLElement.prototype.scrollbarWidth`
* `HTMLElement.prototype.totalWidth`
* `HTMLElement.prototype.totalHeight`
* `HTMLElement.prototype.outerWidth`
* `HTMLElement.prototype.outerHeight`
* `HTMLElement.prototype.innerWidth`
* `HTMLElement.prototype.innerHeight`
* `Node.sortChildren(_children)`
* `Node.prototype.clear(_animation, _delay_each, _callback, _in_scroll_area, _recursive, _emit)`
* `Node.prototype.removeChild(... _args)`
* `Node.prototype.remove(... _args)`
* `HTMLElement.prototype.style`
* `Element.prototype.scrollable`
* `Node.prototype.isBaseElement`
* `HTMLElement.inScrollArea(... _args)`
* `HTMLElement.totallyInScrollArea(... _args)`
* `HTMLElement.prototype.inScrollArea`
* `HTMLElement.prototype.totallyInScrollArea`
* `HTMLElement.prototype.width(_value, _options)`
* `HTMLElement.prototype.height(_value, _options)`
* `HTMLElement.prototype.left(_value, _options)`
* `HTMLElement.prototype.top(_value, _options)`
* `HTMLElement.prototype.right(_value, _options)`
* `HTMLElement.prototype.bottom(_value, _options)`
* `Node.prototype.hasParent(... _args)`
* `HTMLElement.prototype.centerX`
* `HTMLElement.prototype.centerY`
* `HTMLElement.prototype.center(_animate, ... _args)`
* `Node.prototype.movable`
* `Element.prototype.{,_}setAttribute(_key, _value, ... _args)`
* `Element.prototype.{,_}removeAttribute(_key, ... _args)`
* `Node.prototype.textContent`
* `Element.prototype.innerHTML`
* `HTMLElement.prototype.innerText`

## More
There are more extensions than described here, but I want to start at this point.

## Moved
These function have moved to `css.js`.

* `HTMLElement.prototype.parseVariable(... _args)`
* `HTMLElement.prototype.getVariable(... _args)`
* `HTMLElement.prototype.hasVariable(... _args)`
* `HTMLElement.prototype.hasOwnVariable(... _args)`
* `HTMLElement.prototype.removeVariable(... _args)`
* `HTMLElement.prototype.setVariable(... _args)`

### Customized Events
* **`clear`**
* **`change`**

### Moving elements
Assign the `Node` which should be moved to another Node's `.movable` member.

So if you're moving the pointer (after `pointerdown`, see `--movable-buttons` @ [`config.css`](../../../css/config.css))
over a first `Node`, during this another second `Node` will be moved/dragged around.

This is in case you have some kinda 'title bar' or so, which should not move by itself, but
some 'window' Node maybe.. BUT of course you can also just set a `Boolean` (is being 'translated').

### TODO..
//TODO/...
