# stringifyNode(node: INode)

将任意节点字符串化

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
node | [INode](types.md#inode) | The node to be stringified | √ | --

## Return value

Stringified result

## Remarks

- Different operations will be performed for nodes of different nodeType
  - NodeType.Text will directly generate normal text, and will merge the blank characters of textContent
  - NodeType.CDATA will generate CDATA or normal text according to whether it contains "<", and merge blank characters in textContent
  - NodeType.Comments will first merge and trim the textContent with blank characters. If the content is empty after processing, no comment nodes will be created
  - NodeType.DocType will create the <!DOCTYPE> text, and merge the blank characters in the textContent
  - NodeType.Document and NodeType.DocumentFragment will call [stringifySVG](stringify-svg.md) for subsequent processing
  - NodeType.Tag will call [stringifyTag](stringify-tag.md) for subsequent processing
