# Syntax (examples)
* **`/:smile:-96px|#39b/`** // `:smile:` at `96px` plus `#39b` **string** color
* **`/:smile:96pt/`** // `:smile:` at `96pt` and **image** (positive size ;)~
* Use **`!`** as last character before the closing **`/`** to prefer **WebP** `.webp` or **GIF** `.gif over **Lottie** (.json)! :)~

## Lottie
That's the default format, as it got very small files, better graphics, etc..

BUT unfortunately it's not supported by browsers 'as is', so I just implemented to include the
player (from the CDN) whenever a Lottie emoji is being used (and then the player stays..).

_JFYI_: CDN URL for the latest version is: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`.

Include it in the `.html` `<head>` like `<script src="..." crossorigin="anonymous"></script>`.

