<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`cookies`**.js
To easily manage your `document.cookie`; otherwise you'd to deal with long strings (so your key and value plus parameters).

## Parsing/..
The routines will automatically convert numerical cookies to/from `Number` or `BigInt`.

## Functions
These ones are defined in the `document` object:

* `.clearCookies(... _args)`
* `.getCookie(_name)`
* `.getCookies()`
* `.hasCookie(_name)`
* `.hasNumericCookie(_name)`
* `.listCookies()`
* `.removeCookie(_name, _seconds_to_live, _path)`
* `.setCookie(_name, _value, _hours, _path, _same_site, _secure)`

## Proxy
I also added `document.cookies` and `window.cookies` (are the same, references) as a `Proxy` object,
so manage the cookies directly via `cookies[_name]`, e.g.

The used proxy traps are:
* `defineProperty`
* `deleteProperty`
* `get`
* `getOwnPropertyDescriptor`
* `has`
* `isExtensible`
* `ownKeys`
* `set`

So you can just e.g. `++cookies.uptime`, or `delete cookies.test` (same as `cookies['test'] = null` or smth.).
