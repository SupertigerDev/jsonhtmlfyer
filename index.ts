
import { keys } from 'ts-transformer-keys';
let doc: Document;
if (typeof document === "undefined") {
	try {
		const { JSDOM } = require("jsdom")
		doc = (new JSDOM().window).document
	} catch(err) {}
} else {
	doc = document
}




export interface JsonInput {
	tag: Tags,
	styles?: Partial<CSSStyleDeclaration>,
	attributes?: Attributes,
	content?: JsonInput | JsonInput[] | string
}
const tags = ['div', 'img', 'span', 'strong', 'a'] as const

type Tags = typeof tags[number];

interface Attributes {
	href?: string,
	src?: string,
	color?: string,
}
const allowedCssProperties = [
	"display",
	"position",
	"backgroundColor",
	"backgroundImage",
	"backgroundRepeat",
	"backgroundSize",
	"backgroundPosition",
	"color",
	"top",
	"bottom",
	"left",
	"right",
	"width",
	"height",
	"minHeight",
	"minWidth",
	"maxHeight",
	"maxWidth",
	"border",
	"borderRadius",
	"boxShadow",
	"textShadow",
	"overflow",
	"textOverflow",
	"overflowWrap",
	"transition",
	"transform",
	"textDecoration",
	"padding",
	"paddingTop",
	"paddingBottom",
	"paddingLeft",
	"paddingRight",
	"margin",
	"marginTop",
	"marginBottom",
	"marginLeft",
	"marginRight",
	"flex",
	"flexShrink",
	"flexDirection",
	"gap",
	"flexGrow",
	"justifyContent",
	"justifyItems",
	"justifySelf",
	"alignItems",
	"alignContent",
	"alignSelf",
	"whiteSpace",
	"fontFamily",
	"fontSize",
	"fontWeight",
	"zIndex",
	"textAlign"

].map(p => p.toLowerCase())




const iAttributes = keys<Attributes>();



function sanitize(string: string) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
	};
	const reg = /[&<>"'/]/ig;
	return string.replace(reg, (match: string)=>(map[match]));
}

export function jsonToHtml(json: JsonInput, imageProxyUrl: string = "") {
	if (!doc) throw new Error("Please run 'npm i jsdom'")
	if (!json.tag) throw new Error("Tag is required.")
	if (!tags.includes(json.tag)) throw new Error("Invalid Tag: " + json.tag)
	const element = doc.createElement(json.tag)

	if (json.attributes) {
		const attributeKeys = Object.keys(json.attributes);
		for (let i = 0; i < attributeKeys.length; i++) {
			const attrKey: any  = attributeKeys[i];
			if (!iAttributes.includes(attrKey)) throw new Error("Invalid Attribute: " + attrKey)

			if (json.tag.toLowerCase() === "img" && attrKey.toLowerCase() === "src") {
				element.setAttribute(attrKey, imageProxyUrl + encodeURIComponent(json.attributes[attrKey]));
			} else if (attrKey.toLowerCase() === "href" && !json.attributes[attrKey].toLowerCase().startsWith("http")) {
				element.setAttribute(attrKey, "https://" + json.attributes[attrKey]);
			} else {
				element.setAttribute(attrKey, json.attributes[attrKey]);
			}
		}
	}
	if (json.styles) {
		const styleKeys = Object.keys(json.styles);
		for (let s = 0; s < styleKeys.length; s++) {
			const styleKey = styleKeys[s];
			const styleVal = json.styles[styleKey];
			if (!allowedCssProperties.includes(styleKey.toLowerCase())) {
				throw new Error("Invalid CSS Property: " + styleKey)
			}
			if (styleKey.toLowerCase() === "backgroundimage") {
				element.style[styleKey] = `url(${imageProxyUrl + encodeURIComponent(styleVal)})`;
			} else {
				element.style[styleKey] = styleVal;
			}
			
			
		}
	}
	if (typeof json.content === "object") {
		if (Array.isArray(json.content)) {
			for (let c = 0; c < json.content.length; c++) {
				const jsonContent = json.content[c];
				element.innerHTML+= jsonToHtml(jsonContent, imageProxyUrl)	
			}
			return element.outerHTML;
		} else {
			element.innerHTML = jsonToHtml(json.content, imageProxyUrl)!;
			return element.outerHTML;
		}
	}

	if (json.content) {
		element.classList.add("content")
		element.innerHTML = sanitize(json.content as string);
	}
	return element.outerHTML;

}