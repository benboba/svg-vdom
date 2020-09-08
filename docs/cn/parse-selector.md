# parseSelector(query: string)

解析 CSS 选择器字符串

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
query | string | CSS 选择器字符串 | √ | --

## 返回值

- 返回二维数组格式 ISelector[][]，查看 [ISelector](types.md#iselector) 定义
- 第一层数组表示逗号分隔的选择器组
- 第二层数组表示选择器单元（[ISelector](types.md#iselector)）列表

## 备注

- 解析失败将会返回空数组
