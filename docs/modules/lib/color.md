<img src="https://kekse.biz/github.php?draw&text=`color`&override=github:v4" />

# `color`
Since I needed to `.complement()` some colors, I just implemented the `color.js` again (was
already part of the [Lib\[rary\].js](https://libjs.de/)).

## Supported Types
* **hex**
* **rgb**
* **rgba**
* **cmyk**
* **hsv**
* **hsl**
* **array**
* **int**

## Base functions
The base is a new `color` object/function in the global namespace. There we go with:

* `.type(... _args)`
* `.isValid(... _args)`
* `.parse(... _args)`
* `.render(... _args)`

At least this is the current state. All these functions got sub functions named by the
supported color types (see above).

## More functionality
This and more is still TODO. But I'll need it in some days or so, .. so stay tuned. :-)

* `.complement(... _args)`
...

