# svg-vdom

parse svg string and use it like dom

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
[parse](docs/parse.md) | 解析 svg 字符串，生成 virtual-dom
[NodeType](docs/node-type.md) | 节点类型的枚举对象
[ParentNode](docs/parent-node.md) | 父节点的 class
[TextNode](docs/text-node.md) | 文本节点的 class
[TagNode](docs/tag-node.md) | 标签节点的 class
[stringifySVG](docs/stringify-svg.md) | 将 virtual-dom 字符串化
[stringifyNode](docs/stringify-node.md) | 将某个节点字符串化
[stringifyTag](docs/stringify-tag.md) | 将某个标签节点字符串化
[parseSelector](docs/parse-selector.md) | 解析选择器字符串
[selectorUnitCombinator](docs/selector-unit-combinator.md) | css 选择器组合符号的枚举对象
[attrModifier](docs/attr-modifier.md) | css 属性选择器等号修饰符的枚举对象
[matchSelectorGroups](docs/match-selector-groups.md) | 判断一个节点是否命中 css 选择器组
[matchSelectors](docs/match-selectors.md) | 判断一个节点是否命中 css 选择器
[matchSelector](docs/match-selector.md) | 判断一个节点是否命中 css 选择器单元
