<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`page`**.js
A page is loaded on demand, and inserted into the `#MAIN`/`<main>` of the site. So not
the whole website is being reloaded (with all the JavaScript etc.), but only the content,
when necessary (when the user/client requests it).

## Functions
- [x] Catches all clicks on elements with `[href]` attribute (and animates them), if below page path
- [x] Fetches a file (if too big or unsupported MIME type, a download will be offered (if not done manually))
- [x] Presents it, depending on it's MIME type (or file extension if none sent); also animated.
- [x] _Automatically creates a **Table of Contents** (also animated, etc.)_! See [`toc.js`](toc.md)!
- [x] DEAD links will be highlighted and disabled (for an amount of time); with [OSD](osd.md)
- [x] HTML will be pre-processed, inter alia for [`emoji`.js](emoji.md)
- [x] .. AFTER it'll be parsed, inter alia to get only the `<body>` part, etc. (and for the **TOC**, etc.); see `web/html.js`
- [x] Relative links will be converted, so the HTML code can refer relative to it's original location (all `[href]` and `[url]`)
- [x] JavaScript and CSS styles will be selected out (and downloaded partially), for evaluation or better embedding
- [x] Downloads will present a [`progress`.js](progress.md) with percent and/or passed time
- [x] Errors will be presented better (not *only* in the console, which is the usus here..)
- [ ] If downloading a markdown file (`.md` extension), it'll first be converted to `.html` (/TODO/)

