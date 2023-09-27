<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`dialog.js`**
Own **Dialog**/Modal element (`extends HTMLElement`).

Can be used as **alert()** and also as **confirm()**, since optional `.buttons[]`
can be configured. These buttons are `extends HTMLButtonElement`, and at least one
default `OK` is necessary (automatically inserted if no others defined).

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

## Use case(s)
Currently I'm using it instead of regular **`alert()`** or **`confirm()`**, etc.;
e.g. when the [`page`.js](page.md) offers a download (so it's some dialog you can
confirm, the download usually won't start automatically; this is **bad behavior**
in my eyes..).

## Control
Following keys can control any dialog (respective their buttons).

* `<Tab>`, `<Shift>+<Tab>`
* `<Enter>`, `<Space>`
* `<Escape>`
* `<Left>`, `<Right>`
* `<1-9>`
* `<Home>`, `<End>`

