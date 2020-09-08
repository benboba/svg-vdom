# parse(svgstr)

解析 SVG 字符串，生成 virtual dom

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
svgstr | string | SVG 字符串 | √ | --

## 返回值

- 一个类型为 [IDocument](types.md#idocument) 的 [ParentNode](parent-node.md) 实例
- nodeType 为 [NodeType.Document](node-type.md)
- nodeName 为 '#document'
