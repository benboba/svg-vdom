# Node

Abstract class of the basic node, which implements [INode interface](types.md#inode)

## new Node(option: INodeOption)

Basic node constructor

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
option | [INodeOption](types.md#inodeoption) | Configuration item | √ | --

## Node.prototype.nodeName

Node name, type is string

## Node.prototype.nodeType

Node type, allowed value is [NodeType](node-type.md)

## Node.prototype.namespace

The xml namespace of the node

## Node.prototype.parentNode

Parent node of current node

## Node.prototype.cloneNode()

Abstract method, create a copy of the current node 

## Node.prototype.remove()

Remove current node

### Parameters

No

### Return value

Returns a boolean value indicating whether the removal was successful

## Node.prototype.matches(selector: TSelector[, finder: IParentNode])

Verify whether the current node meets the specified judgment conditions

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | Judgment conditions | √ | --
finder | [IParentNode](types.md#iparentnode) | finder | × | --

The finder is used when the selector starts with ">", indicating that the topmost element hit by the selector must be a child element of the finder

### Return value

Returns a boolean value indicating whether the judgment condition is met

## Node.prototype.closest(selector: TSelector)

Starting from the current node, look up the nearest node that meets the judgment condition step by step

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | Judgment conditions | √ | --

### Return value

If a node that meets the conditions can be found, return the node, otherwise return null

### Remarks

- If the current node meets the conditions, it will return to the current node

## Node.prototype.toString()

Stringify the current node

### Parameters

No

### Return value

Stringified result
