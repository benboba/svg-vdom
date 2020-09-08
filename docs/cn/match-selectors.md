# matchSelectors(selectors: ISelector[], node: INode)

判断指定节点是否匹配 CSS 选择器

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
selectors | [ISelector](types.md#iselector)\[] | CSS 选择器单元列表 | √ | --
node | [INode](types.md#inode) | 要判断的节点 | √ | --

## 返回值

返回一个布尔值，表示指定节点是否匹配 CSS 选择器

## 备注

- selectors 传入空数组会返回 false
