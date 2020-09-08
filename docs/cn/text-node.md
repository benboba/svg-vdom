# TextNode

文本节点类，继承自 [Node 抽象类](node.md)，实现 [ITextNode 接口](types.md#itextnode)

## new TextNode(option: ITextNodeOption)

文本节点的构造函数

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
option | [ITextNodeOption](types.md#itextnodeoption) | 配置项 | √ | --

## TextNode.prototype.nodeType

允许的值为 NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType，查看[全部 NodeType](node-type.md)

## TextNode.prototype.textContent

当前节点的文本内容

## TextNode.prototype.cloneNode()

创建当前节点的一个副本，同时复制当前节点的文本内容
