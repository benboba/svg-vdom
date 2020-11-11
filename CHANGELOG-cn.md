# 2020-11-11 v1.0.9

## 功能

- 为 ParentNode 类型增加了一个 children 的只读属性，用于获取子节点中所有的 TagNode
- 现在 matchSelector 会验证 [structural pseudos](TODO：https://drafts.csswg.org/selectors-4/#structural-pseudos)
- 现在 matchSelector 会验证 :target 伪类（必须包含 id 或 name 属性）
- 现在 matchSelector 会验证 :not 伪类
- 现在 matchSelector 会默认通过 :lang、:link、:visited、:hover、:active、:focus 伪类，其它伪类将判断为命中失败

## 修复问题

- 修复了测试用例中的一些 bug

# 2020-10-29 v1.0.8

## 功能

- selector 字符串现在允许以 > 开始
- 现在 matchSelector 不再限制伪类，只对伪元素进行验证

# 2020-10-23 v1.0.7

## 功能

- 伪类/伪元素选择器中增加了 :root 和 ::selection 的支持

# 2020-09-10 v1.0.6

## 功能

- 增加了文档根下不能出现 CDATA 节点的判断和错误提示

## 修复问题

- 修复了遇到文档根下的注释节点会意外报错的 bug
- 发现并解决了解析错误的测试用例并没有生效的问题

# 2020-09-10 v1.0.4 & 1.0.5

## 修复问题

- 修正标签类节点 hasAttribute 方法对含有 namespace 的属性的一个误判
- 补全 parentNode 的文档对于数组类参数的说明
- 修改了 parentNode 操作子节点的方法，避免因直接传入某个节点的 childNodes 导致结果不符合预期

# 2020-09-10 v1.0.3

## 破坏性升级

- umd 格式的 "name" 从 "xml-parser" 修改为 "svgVdom"

## 修复问题

- 修正 docs 中关于 attrModifier 的描述文档的格式问题
- 修正文本类节点解析时会把整个节点放入 textContent 的问题

# 2020-09-08 v1.0.2

## 修复问题

- 移除 typings 目录下文件对 src 目录的依赖

# 2020-09-08 v1.0.1

## 修复问题

- 修复了 d.ts 文件路径错误的问题
- 在 package.json 中增加 types 属性
- 移除了发布版本中的测试用例相关文件

# 2020-09-08 v1.0.0

## 功能

- 第一次提交