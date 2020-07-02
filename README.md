# jsonhtmlfyer
JSON TO HTML. Will be used in Nertivia (nertivia.tk) for html embeds for bots.

# Usage
```js
const { jsonToHtml } = require("jsonhtmlfyer");


const res = jsonToHtml({
    tag: "div",
    styles: {
        backgroundImage: "google.com/owo.png",
    },
}, "IMAGEPROXY.com/")

console.log(res)
```
Will output:
```
<div style="background-image: url(IMAGEPROXY.com/google.com/owo.png);"></div>
```