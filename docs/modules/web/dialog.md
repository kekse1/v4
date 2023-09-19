<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`dialog.js`**
Own **Dialog**/Modal element (`extends HTMLElement`).

Can be used as **alert()** and also as **confirm()**, since optional `.buttons[]`
can be configured. These buttons are `extends HTMLButtonElement`, and at least one
default `OK` is necessary (automatically inserted if no others defined).

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

