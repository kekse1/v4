<img src="https://kekse.biz/github.php?draw&text=`fetching()`&override=github:v4" />

# `fetching()`
This is the default function used instead of regular `fetch()` calls.

It's there as global location for (**async**!) HTTP data transfer, since there are my default headers
and fetch options defined at one place. Until now, I hard-coded it every time a `fetch()` was used..

The `fetch()`'s return will also hold the resulting `.options` object (with headers converted from
regular Objects to `Headers` instances, .. with filtered out non-string values and with all header
keys `.toLowerCase()`..).

## Return value
If called with a **callback function**, the download will call it after end or on error.

In this case you'll get a `{ data, text }` result in the first callback argument. If response became
too large for a String (here around **~512 MiB**), the `text` element will be `null`.

> **Warning**
> Only with real `fetch()` in it, so calling the `fetching.apply()` **won't** return above things,
> but only an options object.

If **no** callback is defined in the arguments, the regular Promise of `fetch()` will be returned (with
`.options` etc. inside of this request). So then you can use `.then()` and `.catch()` as usual.. BUT, as
said in the section right here below, then the [`Progress`](progress.md) won't be used.

## [`new Progress()`](progress.md)
This module already implements a [`Progress`](progress.md) (*if, and only if called with a callback argument*).
It'll be instanciated only **once**, while summing up all response lengths, etc., to show _one_ progress for all.

## Implementation
The three most important functions are:

* **`fetching(... _args)`** the base function, a replacement for the regular `fetch()` function
* **`fetching.fetch(_url, ... _args)`** to be exact, _this_ is the base function. The `fetching()` above is just a relay..
* **`fetching.apply(... _args)`** this is handling/creating/adjusting the fetch **options**

The rest is just some less helper closures, and the following both (see the next section, below, for more info):

* `fetching.getDefaultOptions()`
* `fetching.getDefaultHeaders()`

## My defined **default options**
| Option      | Value                                   |
| ----------: | :-------------------------------------- |
| method      | `GET` (or `POST` if `.body` is defined) |
| redirect    | `follow`                                |
| cache       | `no-cache`                              |
| credentials | `same-origin`                           |

### Plus my **default _headers_** (in the HTTP packet)
| Header **Key** | **Value**   |
| -------------: | :---------- |
| `user-agent`   | `kekse.biz` |
