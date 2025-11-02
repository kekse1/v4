<img src="https://kekse.biz/github.php?draw&text=`GitHub`&override=github:v4" />

# GitHub support
A class to either resolve (my) own `github://` URLs (**not** using `navigator.registerProtocolHandler()`
due to some incompatibilities etc..); or to handle such links.

## Exports
* `class GitHubURL`
* `class GitHubBox`
* `github`

## URLs
* Either only with the GitHub **user** component, then a list of his repositories will be rendered
* Or with **repo** and maybe even **path** component, then URLs will be resolved to `raw.githubusercontent..` etc.

Configuration is (as usual) in my [`config.css`](https://kekse.biz/config.css),
including all (RAW and API) URLs.

## Repository list
Just added the feature to (optionally!) ignore forks, so only own repositories will be listed.

