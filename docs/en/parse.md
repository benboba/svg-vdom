# parse(svgstr)

Parse the SVG string to generate virtual dom

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
svgstr | string | SVG string | √ | --

## Return value

- Return a Promise, if the resolution is successful, you will get the following results:
  - An instance of [ParentNode](parent-node.md) of type [IDocument](types.md#idocument)
  - nodeType is [NodeType.Document](node-type.md)
  - nodeName is '#document'
- If the svgstr does not conform to the following xml specifications, it will fail to parse and throw a corresponding error
  - The xml declaration node is not at the top
  - There is no root element node, or there is more than 1 root element node
  - The label name does not conform to the specification, or the label name does not exist
  - The start tag and end tag cannot match
  - The attribute name does not conform to the specification, or the attribute name is duplicated
  - The text or CDATA node is outside the root element node
