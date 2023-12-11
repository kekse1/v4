<img src="https://kekse.biz/github.php?draw&text=`Module`&override=github:v4" />

# **`class Module`**
Every `eval()` call (actually only one in [`page.js`](page.md)) will be called with a context
we get out of this `module.js`. The reasons:

* At first, they don't need to run in a global context or so, each got it's own one
* The other reason is to provide some **'session'** like logic for those modules

If no `_module` parameter is defined (as String, which is (in [`page.js`](page.md)) the
resolved module/page path..), either an anonymous one-time session is returned, or a single
one which is being shared across multiple modules. This depends on the type of _module argument.

## Effect
The most important effect is obvious: when opening some page with JavaScript embedded or so,
the states _can_ stay the same they was when called this one page before. So there's some 'progress'..

That the defined variables don't reside in the global scope or so is another great effect.

The current module context is available in `this` and also the same in `module` (so if `this`
could be overridden by local sub functions, etc..). Internally, it's given as first argument
of a `new Function()` being used, which is on the other hand also called with `..bind(_ctx, ..);`.

There's also the `params` array available in those modules, btw.

