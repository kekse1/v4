<img src="https://kekse.biz/github.php?draw&text=`file`&override=github:v4" />

# **`file()`**
This is an abstract function to get file data for both local files (via `fs.readFile()`)
or remote files (via my [`fetching`](../web/fetching.md) extension).

So if you're implementing code for both sides (server and client), you don't need to
distinguish which function to use.

## Example
Since my [`mime.js`](./mime.md) 'imports' a `.json` list of types, and this is being
used both in server-side and client-side code (and the `import` is not yet capable
of accessing `.json` files [without warnings]), I needed this code.

## Feature(s)
I'm using my [`fetching`](../web/fetching.md) extension in most cases in the `BROWSER`,
so it's easier to handle, and also utilizing a [`Progress`](../web/progress.md) drawing;
so in the `BROWSER` it'll also automatically use this [`progress.md`](../web/progress.md).

## ...
//TODO/

