<img src="https://kekse.biz/php/count.php?draw&override=github:v4" />

# **`emoji`**.js
A pre-processor to replace HTML code with any emoji-syntax (using my own, see below).

## Syntax (examples)
* **`/:smile:-96px|#39b/`** // `:smile:` at `96px` plus `#39b` **string** color
* **`/:smile:96pt/`** // `:smile:` at `96pt` and **image** (positive size ;)~
* Use **`!`** as last character before the closing **`/`** to prefer **WebP** `.webp` or **GIF** `.gif` over **Lottie** `.json`! :)~

## Lottie
That's the default format, as it got very small files, better graphics, etc..

BUT unfortunately it's not supported by browsers 'as is', so the player is being loaded once a Lottie emoji is being used
(so only once, then it just stays ;)~

> **Note**
> **You** can include it in your `.html`s `<head>` like this:
>
> `<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" crossorigin="anonymous"></script>`.
>
> That's the latest version, directly out of a CDN. :)~
> I don't like this, but it's neccessary..

