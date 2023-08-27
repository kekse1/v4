<img src="https://kekse.biz/php/count.php?draw&override=github:v4&text=v4&draw" />

# **`v4`**
<img src="https://mirror.kekse.biz/noto-emoji-animation/emoji.php?tag=face-in-clouds&type=webp" />
<img src="https://mirror.kekse.biz/noto-emoji-animation/emoji.php?tag=plant&type=webp" />

## Overview

### Modules
See the [Module Index](docs/modules/README.md).

The documentation is splitted like my JavaScript code (in the FS hierarchy).
* **lib**/
* **web**/

I'm using the newer `ES Modules` here (the first time for me). Because they're asynchronous etc.,
whereas my older versions used an own `require()` implementation (which had to be synchronous,
for obvious reasons).

> **Note**
> JFYI: When you read about ES Modules that the `import` and `export` need to be defined at the
> beginning of your files: it's not meant that they need to be 'on top', they just need to be
> in the first level, without any nested structures! So they can also be set on the bottom.. xD~

