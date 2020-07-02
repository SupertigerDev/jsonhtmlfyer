const { jsonToHtml } = require("jsonhtmlfyer");


const res = jsonToHtml({
    tag: "div",
    styles: {
        backgroundImage: "google.com/owo.png",
    },
}, "IMAGEPROXY.com/")

console.log(res)