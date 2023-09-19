<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# MIME
Better MIME type handling (e.g. in the `Content-Type` HTTP header). Used in `web/page.js`, e.g.

> **Note**
> That's important, because such types sometimes got extra parameters (`;` separated), etc..

## Implementation
* `MIME(_param)`
* `MIME.ext(_param, _reverse)`
* `MIME.ext.reverse(_param)`
* `MIME.extension`
* `MIME.parse(_param, _array)`
* `MIME.render(_param)`
* `MIME.type(_param)`
* `MIME.params(_param)`
* `MIME.check(_param)`
* `MIME.check.object(_object)`
* `MIME.check.array(_array)`
* `MIME.check.string(_string)`
* `MIME.toArray(_param)`
* `MIME.toObject(_param)`
* `MIME.toString(_param)`
* `MIME.toArray.fromString(_string)`
* `MIME.toArray.fromArray(_array)`
* `MIME.toArray.fromObject(_object)`
* `MIME.toObject.fromString(_string)`
* `MIME.toObject.fromArray(_array)`
* `MIME.toObject.fromObject(_object)`
* `MIME.toString.fromString(_string)`
* `MIME.toString.fromArray(_array)`
* `MIME.toString.fromObject(_object)`

