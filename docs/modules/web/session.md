<img src="https://kekse.biz/github.php?draw&text=`Session`&override=github:v4" />

# **`class Session`**
Every `eval()` call (actually only one in [`page.js`](page.md)) will be called with a context
we get out of this `session.js`. The reasons:

* At first, they don't need to run in a global context or so, each got it's own one
* The other reason is to provide some **'session'** like logic for those modules

If no `_session` parameter is defined (as String, which is (in [`page.js`](page.md)) the
resolved module/page path..), either an anonymous one-time session is returned, or a single
one which is being shared across multiple modules. This depends on the type of _session argument.

## Effect
The most important effect is obvious: when opening some page with JavaScript embedded or so,
the states _can_ stay the same they was when called this one page before. So there's some 'progress'..

That the defined variables don't reside in the global scope or so is another great effect.
> **Warning**
> This doesn't work atm.. (the only bug left here..) **:-(**

