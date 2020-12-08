# parse(svgstr)

解析 SVG 字符串，生成 virtual dom

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
svgstr | string | SVG 字符串 | √ | --

## 返回值

- 返回一个 Promise，如果解析成功，会得到以下结果：
  - 一个类型为 [IDocument](types.md#idocument) 的 [ParentNode](parent-node.md) 实例
  - nodeType 为 [NodeType.Document](node-type.md)
  - nodeName 为 '#document'
- 如果 SVG 字符串不符合以下 xml 规范，会解析失败并抛出相应的错误
  - xml 声明节点不在最前面
  - 不存在根元素节点，或者存在多于 1 个的根元素节点
  - 标签名不符合规范，或不存在标签名
  - 开始标签和结束标签无法匹配
  - 属性名不符合规范，或者属性名重复
  - 文本或 CDATA 节点位于根元素节点之外
