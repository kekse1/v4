<img src="https://kekse.biz/github.php?draw&override=github:v4" />

# **`v4`**
<!--<img src="https://mirror.kekse.biz/noto-emoji-animation/emoji.php?tag=face-in-clouds&type=webp" />-->
![Gebt mir Kekse!](https://kekse.biz/img/Gebt%20mir%20die%20Kekse%20-%20und%20niemand%20wird%20verletzt.medium.jpg)

## Overview

### Link
[https://**`kekse.biz`**/](https://kekse.biz/)

### **Modules**
See the [**Module INDEX**](docs/modules/README.md); much parts already described here (but still much TODO in here).

### **Scripts**
These are some of my helper scripts.

#### `news`
Full overview over any file update; therefore the [**news** section](https://kekse.biz/?~news).

* [`news.sh`](scripts/news.sh)
* [`news.js`](scripts/news.js)

#### `index`
Automatically manages the **source code** updates.

* [`index.sh`](scripts/index.sh)
* [`index.js`](scripts/index.js)

Since **v0.8.1** this script supports creating and comparing hashes for all the source code files.
Before this update the routine for updating the source/version change timestamp ('version.now')
didn't work very exact..

#### `list` / `docs`
* [**`list.js`**](scripts/list.js) is a general file index script.
* [**`docs.sh`**](scripts/docs.sh) is a concrete use case for it (here for automatic index of my [`~docs`](https://kekse.biz/?~docs));

#### `update`
On all content updates I'm calling this really tiny script.

* [`update.sh`](scripts/update.sh)

#### `version`
This is kinda 'fallback' if I don't update via the [`index`](#index) script.

* [`version.sh`](scripts/version.sh)

#### **Index**
The [**source code** section](https://kekse.biz/?~sources) on [my website](https://kekse.biz/)
acts as index/overview and summary for the **lib**/ and **web**/ JavaScript sources.
Here you shall see more than the [API documentation / Module Index](docs/modules/README.md)
linked above.

### **TODO**
It can be found on my website, look at [**this link**](https://kekse.biz/?~todo).

### **Features**
Here's a list of all end-user features (only those they can really see):
[**~features**](https://kekse.biz/?~features)

### Counter script
See also my own [**`count.php`**](https://github.com/kekse1/count.php/), which is being used in here..

### Configuration
I'm massively using **CSS Custom Properties** (so CSS styles with `--` prefix) to configure
any behavior of my website. See my [**`config.css`**](css/config.css)!

# Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](COPYRIGHT.txt),
and it's licensed under the [MIT](LICENSE.txt) (also known as 'X' or 'X11' license).

<a href="favicon.512px.png" target="_blank">
<img src="favicon.png" alt="Favicon" />
</a>
