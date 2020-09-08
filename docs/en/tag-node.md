# TagNode

Label node class, inherited from [container node class](parent-node.md), implements [ITagNode interface](types.md#itagnode)

## new TagNode(option: IParentNodeOption)

The constructor of the label node

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
option | [IParentNodeOption](types.md#iparentnodeoption) | Configuration item | √ | --

## TagNode.prototype.nodeType

Fixed as NodeType.Tag, view [all NodeType](node-type.md)

## TagNode.prototype.attributes

Attribute list, view [attribute definition](types.md#iattr)

## TagNode.prototype.cloneNode()

Create a copy of the current node, copy all attributes at the same time, but will not copy the parent node and child node list

## TagNode.prototype.hasAttribute(name: string, namespace?: string)

Determine whether the current node has the specified attributes

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
name | string | Attribute name | √ | --
namespace | string | Attribute namespace | × | --

### Return value

Returns a boolean value indicating whether the current node has the specified attribute

### Remarks

- If namespace is not passed, it will be matched according to fullname, otherwise it will be matched according to name

## TagNode.prototype.getAttribute(name: string, namespace?: string)

Get attribute value

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
name | string | Attribute name | √ | --
namespace | string | Attribute namespace | × | --

### Return value

If the specified attribute can be successfully obtained, return the string form of the attribute value, otherwise return null

### Remarks

- If namespace is not passed, it will be matched according to fullname, otherwise it will be matched according to name

## TagNode.prototype.setAttribute(name: string, value: string, namespace?: string)

Set the value of the attribute

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
name | string | Attribute name | √ | --
value | string | Attribute value | √ | --
namespace | string | Attribute namespace | × | --

### Return value

No

### Remarks

- If namespace is not passed, it will be matched according to fullname, otherwise it will be matched according to name

## TagNode.prototype.removeAttribute(name: string, namespace?: string)

Remove attribute

### Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
name | string | Attribute name | √ | --
namespace | string | Attribute namespace | × | --

### Return value

Returns a boolean value indicating whether the attribute was successfully removed

### Remarks

- If namespace is not passed, it will be matched according to fullname, otherwise it will be matched according to name
- If the current node does not have a corresponding attribute, it will return false
