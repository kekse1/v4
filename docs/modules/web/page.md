<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`page`**.js
* Catches all clicks on elements with `[href]` attribute (and animates them), if below page path
* Fetches a file (if too big or unsupported MIME type, a download will be offered (if not done manually))
* Presents it, depending on it's MIME type (or file extension if none sent); also animated.
* _Automatically creates a **Table of Contents** (also animated, etc.)_!
* If downloading a markdown file (`.md` extension), it'll first be converted to `.html`
* DEAD links will be highlighted an disabled (for an amount of time); with [OSD](osd.md)
* HTML will be pre-processed, inter alia for [`emoji`.js](emoji.md)
* .. AFTER it'll be parsed, inter alia to get only the `<body>` part, etc. (and for the TOC, etc., w/ traversion, etc.)
* Relative links will be converted, so the HTML can refer relative to it's original location (all `[href]` and `[url]`)
* JavaScript and CSS styles will be selected out (and downloaded partially), for evaluation or better embedding
* Downloads will present a [`progress`.js](progress.md) with percent and/or passed time
* Errors will be presented better (not *only* in the console, as usual for any things)
* etc. pp....

