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
import { parse } from 'svg-vdom';
const vdom = parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<title>square</title>
		<g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
            <rect id="Rectangle-7" x="0" y="0" width="42" height="42"></rect>
		</g>
    </svg>`);

console.log(vdom.childNodes.length); // 2
console.log(vdom.querySelector('#Page-1')); // g#Page-1
```

## Api

名称 | 说明
---- | ----
[parse](docs/parse-zh.md) | 解析 svg 字符串，生成 virtual-dom
[NodeType](docs/node-type-zh.md) | 节点类型的枚举对象
[ParentNode](docs/parent-node-zh.md) | 父节点的 class
[TextNode](docs/text-node-zh.md) | 文本节点的 class
[TagNode](docs/tag-node-zh.md) | 标签节点的 class
[stringifySVG](docs/stringify-svg-zh.md) | 将 virtual-dom 字符串化
[stringifyNode](docs/stringify-node-zh.md) | 将某个节点字符串化
[stringifyTag](docs/stringify-tag-zh.md) | 将某个标签节点字符串化
[parseSelector](docs/parse-selector-zh.md) | 解析选择器字符串
[selectorUnitCombinator](docs/selector-unit-combinator-zh.md) | css 选择器组合符号的枚举对象
[attrModifier](docs/attr-modifier-zh.md) | css 属性选择器等号修饰符的枚举对象
[matchSelectorGroups](docs/match-selector-groups-zh.md) | 判断一个节点是否命中 css 选择器组
[matchSelectors](docs/match-selectors-zh.md) | 判断一个节点是否命中 css 选择器
[matchSelector](docs/match-selector-zh.md) | 判断一个节点是否命中 css 选择器单元
