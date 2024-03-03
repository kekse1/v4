<img src="https://kekse.biz/github.php?draw&text=`Help`&override=github:v4" />

# **`class Help` (global as `Help`)
A help, which is some **PopUp**/**ToolTip**, is only working on desktops, not mobile
browsers; or, better said, it works only with **mouse** (not touch or pen).

It's my own, extended version of a simple popup for HTML Nodes with their
`title` attribute.

## Node attributes
| Attribute/Member **key** | Description                                                                             |
| -----------------------: | :-------------------------------------------------------------------------------------- |
| **`help`**               | Regular HTML content/data for this popups                                               |
| **`helpText`**           | The same, but plain text. HTML code displayed **raw**                                   |
| **`title`**              | HTML spec. conform version, less priority than both above                               |
| **`alt`**                | Normally for images, but shown as this `Help` popup                                     |
| **`href`**               | Fallback (if nothing else); shows clickable link (rendered, see [`URL`](../lib/url.md)) |
| **`helpStyle`**          | Define **additional** CSS styles for the `Help` node/element                            |
| **`helpClass`**          | Also **additional** CSS classes (space separated list!)                                 |

The other way to (un-)set these ones as (node) object members, without HTML
attributes. Great thing when setting whole HTML **Node**s as payload/content,
which is - especially when node's content quickly changes, or is in it's own
movement - more performant than to always change a text/code member/attribute!

### Disabling (if parents define any help)
When you define empty Strings as content, there will no such popup be
generated, even if parent nodes define some! Good be quite important!

### Clearing
* `Node.prototype.clearHelp(_more = true, _apply = true)`

Delete any defined help on a `Node`. `_more` to also clear styles and classes, and the
`_apply` to also directly close a maybe opened Help element.

BUT dynamically change the attributes/members (the ones above) also directly
changes or closes open Helps.

## `EventTarget`
Since the `.related` elements are EventTargets, they'll fire a `help` event
both on `.show()` and `.hide()` (w/ this as the `_event.type` parameter).

## `Freeze` support
Look at [`freeze.js`](freeze.md) for more info.

