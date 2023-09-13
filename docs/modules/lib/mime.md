<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# MIME
Better MIME type handling (e.g. in the `Content-Type` HTTP header). Used in `web/page.js`, e.g.

> **Note**
> That's important, because such types sometimes got extra parameters (`;` separated), etc..

## Implementation
* `MIME(_param, ... _args)`
* `MIME.ext(_param, _reverse)`
* `MIME.ext.reverse(_param)`
* `MIME.extension`
* `MIME.parse(_param, _array, ... _args)`
* `MIME.render(_param, ... _args)`
* `MIME.type(_param, ... _args)`
* `MIME.params(_param, ... _args)`
* `MIME.check(_param, ... _args)`
* `MIME.check.object(_object, ... _args)`
* `MIME.check.array(_array, ... _args)`
* `MIME.check.string(_string, ... _args)`
* `MIME.toArray(_param, ... _args)`
* `MIME.toObject(_param, ... _args)`
* `MIME.toString(_param, ... _args)`
* `MIME.toArray.fromString(_string, ... _args)`
* `MIME.toArray.fromArray(_array, ... _args)`
* `MIME.toArray.fromObject(_object, ... _args)`
* `MIME.toObject.fromString(_string, ... _args)`
* `MIME.toObject.fromArray(_array, ... _args)`
* `MIME.toObject.fromObject(_object, ... _args)`
* `MIME.toString.fromString(_string, ... _args)`
* `MIME.toString.fromArray(_array, ... _args)`
* `MIME.toString.fromObject(_object, ... _args)`

