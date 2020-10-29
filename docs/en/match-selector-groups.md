# matchSelectorGroups(selectorGroups: ISelector[][], node: INode[, finder: IParentNode])

Determine whether the specified node matches the CSS selector group

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selectorGroups | [ISelector](types.md#iselector)\[]\[] | CSS selector grouping | √ | --
node | [INode](types.md#inode) | Node to be judged | √ | --
finder | [IParentNode](types.md#iparentnode) | Finder | × | --

## Return value

Returns a boolean value indicating whether the specified node matches the CSS selector group

## Remarks

- selectorGroups passing in an empty array will return false
- finder is used to determine whether the selector starts with ">"
