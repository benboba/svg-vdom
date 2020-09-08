# matchSelectors(selectors: ISelector[], node: INode)

Determine whether the specified node matches the CSS selector

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
selectors | [ISelector](types.md#iselector)\[] | List of CSS selector units | √ | --
node | [INode](types.md#inode) | Node to be judged | √ | --

## Return value

Returns a boolean value indicating whether the specified node matches the CSS selector

## Remarks

- selectors passing in an empty array will return false
