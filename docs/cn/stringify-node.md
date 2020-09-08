# stringifyNode(node: INode)

将任意节点字符串化

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
node | [INode](types.md#inode) | 要进行字符串化的节点 | √ | --

## 返回值

字符串化后的结果

## 备注

- 对于不同 nodeType 的节点会执行不同的操作
  - NodeType.Text 会直接生成普通文本，会对 textContent 进行空白字符合并
  - NodeType.CDATA 会根据是否包含 “<” 生成 CDATA 或普通文本，会对 textContent 进行空白字符合并
  - NodeType.Comments 会首先对 textContent 进行空白字符合并和 trim，如果处理之后内容为空，则不会再创建注释节点
  - NodeType.DocType 会创建 <!DOCTYPE> 文本，会对 textContent 进行空白字符合并
  - NodeType.Document 和 NodeType.DocumentFragment 会调用 [stringifySVG](stringify-svg.md) 进行后续处理
  - NodeType.Tag 会调用 [stringifyTag](stringify-tag.md) 进行后续处理
