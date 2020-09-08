# stringifySVG(dom?: IParentNode | null)

Stringify the container node as a virtual dom

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
dom | [IParentNode](types.md#iparentnode)/null | The container node to be stringified | × | --

## Return value

Stringified result

## Remarks

- If the dom parameter is null or not passed, an empty string will be returned
- Only the child nodes of dom will be stringified, the dom node itself will be ignored
