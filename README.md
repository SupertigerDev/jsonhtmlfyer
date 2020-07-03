# jsonhtmlfyer
JSON TO HTML. Will be used in Nertivia (nertivia.tk) for html embeds for bots.

# Install
```npm i jsonhtmlfyer```
Note: If youre using this in the server (no renderer), install this aswell: <br>
```npm i jsdom```

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
```html
<div style="background-image: url(IMAGEPROXY.com/google.com/owo.png);"></div>
```