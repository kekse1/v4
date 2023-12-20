<img src="https://kekse.biz/github.php?draw&text=`fetching()`&override=github:v4" />

# `fetching()`
This is the default function used instead of regular `fetch()` calls. It'll return the original result,
so a Promise you can use by `.then()` and `.catch()`.

It's there as global location for (**async**!) HTTP data transfer, since there are my default headers
and fetch options defined at one place. Until now, I hard-coded it every time a `fetch()` was used..

The `fetch()`'s return will also hold the resulting `.options` object (with headers converted from
regular Objects to `Headers` instances, .. with filtered out non-string values and with all header
keys `.toLowerCase()`..).

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

