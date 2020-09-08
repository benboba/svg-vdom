# stringifyTag(tag: ITagNode)

Stringify tag nodes

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
tag | [ITagNode](types.md#itagnode) | Tag node to be stringified | √ | --

## Return value

Stringified result

## Remarks

- If no child nodes are included, the current label will be self-closing and no end label will be generated
- The attribute will use double quotation marks uniformly, and the double quotation marks in the attribute value will be converted to \&quot;
- Trim the attribute value
- If tags and attributes contain namespace, they will be reflected in the results
