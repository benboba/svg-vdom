# ParentNode

The container node class, inherited from [Node abstract class](node.md), implements [IParentNode interface](types.md#iparentnode)

## new ParentNode(option: IParentNodeOption)

Constructor of container node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
option | [IParentNodeOption](types.md#iparentnodeoption) | Configuration item | √ | --

## ParentNode.prototype.nodeType

Allowed values are NodeType.Tag | NodeType.Document | NodeType.DocumentFragment, view [all NodeType](node-type.md)

## ParentNode.prototype.childNodes

Child node list

## ParentNode.prototype.cloneNode()

Create a copy of the current node, but will not copy the parent node and child node list

## ParentNode.prototype.appendChild(childNode: INode | INode[])

Insert child node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | List of child nodes/child nodes to be inserted | √ | --

### Return value

Returns a boolean value indicating whether the insertion is successful

### Remarks

- If the insert is DocumentFragment, all the child nodes of DocumentFragment will be inserted instead, and the list of child nodes of DocumentFragment will be cleared
- If you try to insert the node itself or an ancestor node, it will return false
- If you insert an existing child node, the position of the child node will be changed

## ParentNode.prototype.insertBefore(childNode: INode | INode[], previousTarget: INode)

Insert node before the specified child node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | List of child nodes/child nodes to be inserted | √ | --
previousTarget | [INode](types.md#inode) | Before which child node to insert | √ | --

### Return value

Returns a boolean value indicating whether the insertion is successful

### Remarks

- If the insert is DocumentFragment, all the child nodes of DocumentFragment will be inserted instead, and the list of child nodes of DocumentFragment will be cleared
- If you try to insert the node itself or an ancestor node, it will return false
- If you insert an existing child node, the position of the child node will be changed
- If previousTarget is not a child of the current node, it will be inserted at the end of the current node list

## ParentNode.prototype.replaceChild(newChild: INode | INode[], oldChild: INode)

Replace child node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
newChild | [INode](types.md#inode)/INode[] | List of child nodes/child nodes to be inserted | √ | --
oldChild | [INode](types.md#inode) | Which child node to replace | √ | --

### Return value

If oldChild is successfully replaced, oldChild will be returned. Otherwise return null

### Remarks

- If the insert is DocumentFragment, all the child nodes of DocumentFragment will be inserted instead, and the list of child nodes of DocumentFragment will be cleared
- If you try to insert the node itself or an ancestor node, it will be ignored
- If newChild is oldChild, it will be ignored
- If you insert an existing child node, the position of the child node will be changed
- If oldChild is not a child of the current node, it will be inserted at the end of the current node list

## ParentNode.prototype.removeChild(childNode: INode | INode[])

Remove child node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | List of child nodes/child nodes to be removed | √ | --

### Return value

Returns a boolean value indicating whether childNode was successfully removed

### Remarks

- If childNode is not a child node of the current node, it will not be removed and will return false

## ParentNode.prototype.querySelector(selector: TSelector)

Find eligible descendant nodes

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | Query conditions | √ | --

### Return value

If the corresponding node can be found, return the first matching node, otherwise return null

### Remarks

- Recursively search from the child nodes of the current node

## ParentNode.prototype.querySelectorAll(selector: TSelector)

Find eligible descendant nodes

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | Query conditions | √ | --

### Return value

Return a list of all eligible nodes, if there are no eligible nodes, return an empty array

### Remarks

- Recursively search from the child nodes of the current node
