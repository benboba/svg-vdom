# parseSelector(query: string)

Parse CSS selector string

## Parameters

Name | Type | Description | Required | Default
---- | ---- | ---- | ---- | ----
query | string | CSS selector string | √ | --

## Return value

- Return two-dimensional array format ISelector[][], view [ISelector](types.md#iselector) definition
- The first level array represents a comma-separated selector group
- The second level array represents the list of selector units \([ISelector](types.md#iselector))

## Remarks

- Failure to parse will return an empty array
