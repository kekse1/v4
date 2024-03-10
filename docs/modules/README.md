<img src="https://kekse.biz/github.php?draw&override=github:v4&text=`v4`&draw" />

# Index
* [Module INDEX](#module-index)
	* [**lib**/](#lib)
	* [**web**/](#web)
	* [**test**/](#test)
	* [**app**/](#app)

// <b>TODO</b> /

# Introduction
I'm using 'ES modules' here, which is the first time for me.
All my old implementations used `require()` ('CommonJS modules'),
also as my own implementation (which had to be **sync**hronous,
for obvious reasons).

> **Warning**
> I'm implementing everything as **asynchronous** as I can!
> **But** I'm also avoiding any Promise as good as I can.. xD~

## Configuration
Beneath the regular configuration elements (like [`config.css`](../../css/config.css), which will maybe be used at
server-side, too?) most `.js` files got some `const DEFAULT_*` constants defined on their
tops; .. for things that don't really fit into some configuration, but which are nevertheless
not really static. Thus, avoiding hard-coded styles etc., just look at the files beginnings, too.

## TODO
Here's the whole [**TODO**](https://kekse.biz/home/todo/) (and there's an extra menu item on
the website itself for it).

# Module INDEX
This `.md`s will grow in time.. currently I'm busy with implementing
all this shit (actually there's much more finished\[tm\], but still
needs to be documentated in here).

## **lib**/
* [`alphabet`.js](lib/alphabet.md)
* [`callback`.js](lib/callback.md)
* [`camel`.js](lib/camel.md)
* [`color`.js](lib/color.md)
* [`config`.js](lib/config.md)
* [`console`.js](lib/console.md)
* [`date`.js](lib/date.md)
* [`file`.js](lib/file.md)
* [`getopt`.js](lib/getopt.md)
* [`globals`](lib/globals/README.md)
* [`id`.js](lib/id.md)
* [`levenshtein`.js](lib/levenshtein.md)
* [`mime`.js](lib/mime.md)
* [`multiset`.js](lib/multiset.md)
* [`path`.js](lib/path.md)
* [`radix`.js](lib/radix.md)
* [`url`.js](lib/url.md)

## **web**/
* [`animation`.js](web/animation.md)
* [`cookies`.js](web/cookies.md)
* [`css`.js](web/css.md)
* [`dialog`.js](web/dialog.md)
* [`element`.js](web/element.md)
* [`event`.js](web/event.md)
* [`fetching`.js](web/fetching.md)
* [`freeze`.js](web/freeze.md)
* [`github`.js](web/github.md)
* [`hash`.js](web/hash.md)
* [`help`.js](web/help.md)
* [`html`.js](web/html.md)
* [`markdown`.js](web/markdown.md)
* [`mobile`.js](web/mobile.md)
* [`module`.js](web/module.md)
* [`osd`.js](web/osd.md)
* [`page`.js](web/page.md)
* [`progress`.js](web/progress.md)
* [`test`.js](web/test.md)
* [`toc`.js](web/toc.md)
* [`window`.js](web/window.md)

## **test**/
Here are (and will be) all my own unit tests (manually done!), especially
for the [**globals**/](lib/globals/README.md)..!

## **app**/
These are (and will be) stand-alone apps, mostly for the server-side, .. but
also some web-apps which I'm planning, so also the news-, blog- or guestbook-
modules.

Since I'm mostly developing my [_personal website_](https://kekse.biz/) here,
I'm going to implement my own web server, inter alia with **WebSocket API**
support (of course, all from scratch, without using the modules of Node.js
or any of the npm modules..).

