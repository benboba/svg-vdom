# svg-vdom

This is a util that parses SVG strings and uses DOM-like APIs to manipulate them.

[中文版](README-cn.md) | [Change Logs](CHANGELOG.md)

## Installation and use

Install from npm

```
npm install svg-vdom -D
```

Install from yarn

```
yarn add svg-vdom -D
```

Use

```js
import { parse, NodeType } from 'svg-vdom';
parse(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<title>square</title>
	<g id="Page-1" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">
		<rect id="Rectangle-7" x="0" y="0" width="42" height="42"></rect>
	</g>
</svg>`).then(vdom => {
	console.log(vdom.childNodes.length); // 2
	console.log(vdom.querySelector('#Page-1')); // g#Page-1
	console.log(NodeType[vdom.nodeType]); // 'Document'
	console.log(vdom.toString());
});
```

## Api

Name | Description
---- | ----
[parse](docs/en/parse.md) | Parse the SVG string to generate virtual-dom
[NodeType](docs/en/node-type.md) | Enum object of node type
[ParentNode](docs/en/parent-node.md) | The class of the container node
[TextNode](docs/en/text-node.md) | The class of the text node
[TagNode](docs/en/tag-node.md) | The class of the label node
[stringifySVG](docs/en/stringify-svg.md) | Stringify virtual-dom
[stringifyNode](docs/en/stringify-node.md) | Stringify a node
[stringifyTag](docs/en/stringify-tag.md) | Stringify a tag node
[parseSelector](docs/en/parse-selector.md) | Parse the selector string
[selectorUnitCombinator](docs/en/selector-unit-combinator.md) | CSS selector combo symbol enumeration object
[attrModifier](docs/en/attr-modifier.md) | CSS attribute selector equal sign enumeration object
[matchSelectorGroups](docs/en/match-selector-groups.md) | Determine whether a node matches the CSS selector group
[matchSelectors](docs/en/match-selectors.md) | Determine whether a node matches the CSS selector
[matchSelector](docs/en/match-selector.md) | Determine whether a node matches the CSS selector unit
