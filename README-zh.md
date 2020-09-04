# svg-vdom

这是一款解析 svg 字符串，并使用类似 DOM 的 Api 去操作它们的工具。

## 安装和使用

从 npm 安装

```
npm install svg-vdom -D
```

从 yarn 安装

```
yarn add svg-vdom -D
```

使用

```js
const svgVdom = require('svg-vdom');
const vdom = svgVdom.parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<title>square</title>
		<g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
            <rect id="Rectangle-7" x="0" y="0" width="42" height="42"></rect>
		</g>
    </svg>`);

console.log(vdom.childNodes.length); // 2
console.log(vdom.querySelector('#Page-1')); // g#Page-1
```

