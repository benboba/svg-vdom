# TagNode

标签节点类，继承自[容器节点类](parent-node.md)，实现 [ITagNode 接口](types.md#itagnode)

## new TagNode(option: IParentNodeOption)

标签节点的构造函数

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
option | [IParentNodeOption](types.md#iparentnodeoption) | 配置项 | √ | --

## TagNode.prototype.nodeType

固定为 NodeType.Tag，查看[全部 NodeType](node-type.md)

## TagNode.prototype.attributes

属性列表，查看[属性定义](types.md#iattr)

## TagNode.prototype.cloneNode()

创建当前节点的一个副本，同时复制所有的属性，但不会复制父节点和子节点列表

## TagNode.prototype.hasAttribute(name: string, namespace?: string)

判断当前节点是否具有指定属性

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
name | string | 属性名 | √ | --
namespace | string | 属性的命名空间 | × | --

### 返回值

返回一个布尔值，表示当前节点是否具有指定属性

### 备注

- 如果未传 namespace，会按照 fullname 进行匹配，否则按照 name 进行匹配

## TagNode.prototype.getAttribute(name: string, namespace?: string)

获取属性

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
name | string | 属性名 | √ | --
namespace | string | 属性的命名空间 | × | --

### 返回值

如果可以成功获取到指定属性，返回该属性值的字符串形式，否则返回 null

### 备注

- 如果未传 namespace，会按照 fullname 进行匹配，否则按照 name 进行匹配

## TagNode.prototype.setAttribute(name: string, value: string, namespace?: string)

设置属性

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
name | string | 属性名 | √ | --
value | string | 属性的值 | √ | --
namespace | string | 属性的命名空间 | × | --

### 返回值

无

### 备注

- 如果未传 namespace，会按照 fullname 进行匹配，否则按照 name 进行匹配

## TagNode.prototype.removeAttribute(name: string, namespace?: string)

移除属性

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
name | string | 属性名 | √ | --
namespace | string | 属性的命名空间 | × | --

### 返回值

返回一个布尔值，表示是否成功移除了属性

### 备注

- 如果未传 namespace，会按照 fullname 进行匹配，否则按照 name 进行匹配
- 如果当前节点并没有对应属性，会返回 false
