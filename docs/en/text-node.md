# TextNode

Text node class, inherited from [Node abstract class](node.md), implements [ITextNode interface](types.md#itextnode)

## new TextNode(option: ITextNodeOption)

The constructor of the text node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
option | [ITextNodeOption](types.md#itextnodeoption) | Configuration item | √ | --

## TextNode.prototype.nodeType

Allowed values are NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType, see [All NodeType](node-type.md)

## TextNode.prototype.textContent

The text content of the current node

## TextNode.prototype.cloneNode()

Create a copy of the current node and copy the text content of the current node
