<img src="https://kekse.biz/github.php?draw&text=`Progress`&override=github:v4" />

# **`css`**.js
The documentation for this file is still *TODO*!

## `[window.]css` functions
These are mostly (and much!) used for **CSS custom properties**!!

### `.parse()`
//TODO/

### `[.parse].url()`
//TODO/

### `.render()`
//TODO/

## `CSSStyleDeclaration`
These enhance the functionaly, but also use the [`camel`.js module](../lib/camel.md) for
some CSS property accessing functions (they partially don't support CAMEL CASED property
access), or you can set `Boolean`, `Number`, and even `Object` and `Array` (which will
also be correctly parsed, see above); the `Object` is a **functional style**, btw.

### Implementation
* `.hasProperty(... _args)`
* `.parse(... _args)`
* `.setProperty(_key, _value, ... _args)`
* `.removeProperty(_key, ... _args)`
* `.getPropertyValue(_key, ... _args)`
* `.getPropertyPriority(_key, ... _args)`
* `HTMLElement.prototype.parseVariable(... _args)`
* `HTMLElement.prototype.getVariable(... _args)`
* `HTMLElement.prototype.hasVariable(... _args)`
* `HTMLElement.prototype.hasOwnVariable(... _args)`
* `HTMLElement.prototype.removeVariable(... _args)`
* `HTMLElement.prototype.setVariable(_variables, _value, _camel)`

## CSS Custom Properties
Either we directly use the `getComputedStyle()` styles to query for variables,
which will always inherit from parent nodes, or - either manually or if the
queried element is not connected (`.isConnected`) - the functions will simply
traverse up each real `.parentNode` and continue the queries there.

