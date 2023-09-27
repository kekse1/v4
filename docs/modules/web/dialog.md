<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`dialog.js`**
... `extends HTMLElement`. Can be used as **`alert()`**, **`confirm()`** or **`prompt()`** replacement.

## Features
* Supports dynamic/variable buttons (using `class DialogButton extends HTMLButtonElement`);
* Plus optional input *text* field (using `class DialogInput extends HTMLInputElement`);
* The document without dialog(s) will be locked when at least one Dialog is open (really open, not just as instance).
* Plus: it will be blurred out a bit, etc.

## Usage
The 'easiest' way is to just call `dialog(... _args)`; the result will be the instance.

### Parameters
Either directly to the constructor (so `new Dialog()`), or to `Dialog.create()` or just
to the `dialog()` function mentioned above. These possible parameters/arguments are:

* `(String)`: the text/message to show (by default w/ `white-space: pre`).
* `(Function)`: the callback after dialog is really closed, with selected parameters
* `(Boolean)`: whether to add a text input prompt, if textual input needs to be asked for
* `(Integer)`: an optional TIMEOUT for the whole dialog (after this it will be closed, w/o result)
* `(Array)`: either only Strings for the buttons, or each w/ `[0] = string` and `[1] = callback`
* `(Object)`: either real options which are implemented here, or CSS styles/variables

### Event(s)
Since this class is extending a regular `HTMLElement`, it's also implementing the `EventTarget`,
which was in turn extended with my own `.emit()` function (see [**`event`.js**](event.md)).

So if you've enabled the `.input` (by setting it to true, btw. with optional `.default` string
as the input element's placeholder), you can also `(Dialog).addEventListener('input', ...)`.

## Keyboard Control
Following keys can control any dialog (respective their buttons).

* `<Tab>`, `<Shift>+<Tab>`
* `<Enter>`, `<Space>`
* `<Escape>`
* `<Left>`, `<Right>`
* `<1-9>`
* `<Home>`, `<End>`

