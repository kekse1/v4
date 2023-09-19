<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# `text/markdown`
Since some HTTPDs won't set this content/mime type, I'm manually overriding
it if the file extension is `.md`.

## Loading
My [`page`.js](page.md) does anything necessary, as usual when loading pages.

But this time, with a markdown document, it'll first use the github API to
convert the document into regular `text/html`.

## TOC
As usual with `text/html` the [`Table of Contents`](toc.md) will also be
automatically created.

