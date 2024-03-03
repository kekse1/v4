<img src="https://kekse.biz/github.php?draw&text=`URL`&override=github:v4" />

# **`URL`** (extensions)
I got own extensions to the `URL` class.

## Rendering URL's (HTML code)
This is an important feature, especially in the **web** code:

* **`URL.render(_url, ... _args)`**
* **`URL.prototype.render(... _args)`**

The [`config.css`](../../../css/config.css) holds the styles, etc..
See it's Custom Properties starting with `--url-`.

## All extensions together
* `URL.supportedProtocols`
* `URL.isSupportedProtocol(_url_href)`
* `URL.prototype.isSupportedProtocol`
* `URL.fileURLToPath(_value)`
* `URL.prototype.base`
* `URL.prototype.param`
* `URL.prototype.withoutParams`
* `URL.prototype.params`
* `URL.params(_string)`
* `URL.tryHash(_string)`
* `URL.trySearch(_string)`
* `URL.prototype.rest`
* `URL.keys`
* `URL.parse(_object, _string)`
* `URL.prototype.toObject()`
* `URL.Hash` (see the [**`hash.js`**](../web/hash.md))
* `URL.render(_url, ... _args)`
* `URL.prototype.render(... _args)`
* `URL.equal(_a, _b, _protocol, _port)` (see also [`path.js`](../lib/path.md))

.. and is still *TODO* (also at [`address.js`](address.md)).

