<img src="https://kekse.biz/github.php?draw&text=`TOC`&override=github:v4" />

# **`toc.js`**
Extends the [`page.js`](page.md).

**Automatically** creates a **Table of Contents** for the loaded page.
On scrolling, and on pointer moves, etc., the highlightning changes.

## Functionality
How? Traverses through all the `<h1>` to `<h6>` in a page/document.

Their content will be adapted with the particular 'path', and on the
right site of the website the #TOC is created with `<ol>` and `<li>`
(which is optional - if a site has no such `<h*>` elements, or when
it's just `text/plain`, the whole #TOC will be disabled and hidden).

