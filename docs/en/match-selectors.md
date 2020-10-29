# matchSelectors(selectors: ISelector[], node: INode[, finder: IParentNode])

Determine whether the specified node matches the CSS selector

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selectors | [ISelector](types.md#iselector)\[] | List of CSS selector units | √ | --
node | [INode](types.md#inode) | Node to be judged | √ | --
finder | [IParentNode](types.md#iparentnode) | Finder | × | --

## Return value

Returns a boolean value indicating whether the specified node matches the CSS selector

## Remarks

- selectors passing in an empty array will return false
- finder is used to determine whether the selector starts with ">"
