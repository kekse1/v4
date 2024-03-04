<img src="https://kekse.biz/github.php?draw&text=`Page`&override=github:v4" />

# **`page`**.js
A page is loaded on demand, and inserted into the `#MAIN`/`<main>` of the site. So not
the whole website is being reloaded (with all the JavaScript etc.), but only the content,
when necessary (when the user/client requests it).

## Functions
- [x] Insert all newly loaded HTML nodes into the `#MAIN` element (after parsing by [`html.js`/`DOMParser`](html.md));
- [x] Comment nodes (`.nodeType === Node.COMMENT_NODE`) will be filtered out (so admins/designer can securely/privately use 'em);
- [x] Catches all clicks on elements with `[href]` attribute (and animates them), if below page path
- [x] Fetches a file (if too big or unsupported MIME type, a download will be offered (if not done manually))
- [x] Presents it, depending on it's MIME type (or file extension if none sent); also animated.
- [x] _Automatically creates a **Table of Contents** (also animated, etc.)_, see [`toc.js`](toc.md)!
- [x] DEAD links will be highlighted and disabled (for an amount of time); with [`osd.js`](osd.md)
- [x] Any `text/html` data will be parsed using [`html.js`](html.md). In there's more magic..
- [x] Relative links will be converted, so the HTML code can refer relative to it's original location (all `[href]` and `[url]`)
- [x] JavaScript and CSS styles will be selected out (and downloaded partially), for evaluation or better embedding (see [`module.js`](module.md));
- [x] The JavaScript's mentioned above will also be evaluated, right AFTER all content was inserted (see [`module.js`](module.md);
- [x] Downloads will present a [`progress`.js](progress.md) with percent and/or passed time
- [x] Errors will be presented better (not *only* in the console, which is the usus here..)
- [x] If downloading a markdown file, it'll first be converted to `text/html` (and then handled as usual)
- [x] Using the GitHub API to either render a list of repositories, or an index of files in each one.
- [x] Since it's an `EventTarget`, we also got some own events being fired here, after starting to load..
- [x] And since I've got my own `URL[.prototype].render()` (better style in HTML), after loading all/some will be replaced
- [x] Anchor `<a>` without content will also be `URL[.protoype].render()`ed automatically now.

