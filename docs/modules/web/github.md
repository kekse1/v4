<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# GitHub
There are two reasons for this (beneath the [`markdown`.js](markdown.md)).

### Repositories
On my `Projects` page I want to present a list of my projects which are on
my [`kekse1/`](https://github.com/kekse1/) github page.

So I'm using the API to get a JSON with all my repositories in it. The
[`page`.js](page.md) will handle everything.

### URLs
I'm using my own **`github:`** URL (scheme) for this reason.

They'll be converted to an object like `{ user, repo, path }`, and then
be used to either ask the API as described above (if only the `{user}`
component is defined) or by converting to a RAW URL (`raw.githubusercontent..`).

## Tree
The latest feature is using the API to receive the repository contents, so
I can easily list such an index of files on my website now.

## Configuration
The `config.css` file holds all necessary config variables (like the URLs, etc.)

