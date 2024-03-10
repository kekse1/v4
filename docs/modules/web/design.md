<img src="https://kekse.biz/github.php?draw&text=`Design`&override=github:v4" />

# **`design`**.js
Got **two** classes in here:

* **`window.Design = class Design`**
* **`Design.Element = class DesignElement`**

The main intention is to replace direct access to the base design elements; see
the `static get elements()`, as follows:

* **HTML**
* **HEAD**
* **BODY**
* **PAGE**
* **MENU**
* **BUTTON**
* **MAIN**
* **INFO**
* **TOC**
* **STATE**

So I designed this `DesignElement` **PROXY** class.

## Most important members ..
... for the **PROXY** object of the `DesignElement` class and it's instances:

* **`static isOwnProperty(_key)`**
* **`static get default()`**
* `static getProxy(_this)`

* **`___destroy()`**
* **`___original`**
* **`___destroyed`**

## Reason(s)
Try to think about it for yourself. I'm going to explain this **l8rs**..

