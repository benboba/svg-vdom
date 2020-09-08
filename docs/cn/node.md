# Node

基本节点的抽象类，实现 [INode 接口](types.md#inode)

## new Node(option: INodeOption)

基本节点的构造函数

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
option | [INodeOption](types.md#inodeoption) | 配置项 | √ | --

## Node.prototype.nodeName

节点名称，类型为字符串

## Node.prototype.nodeType

节点类型，允许的值为 [NodeType](node-type.md)

## Node.prototype.namespace

节点的 xml 命名空间

## Node.prototype.parentNode

当前节点的父节点

## Node.prototype.cloneNode()

抽象方法，创建当前节点的副本

## Node.prototype.remove()

移除当前节点

### 参数

无

### 返回值

返回一个布尔值，表示是否成功移除

## Node.prototype.matches(selector: TSelector)

验证当前节点是否符合指定的判断条件

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | 判断条件 | √ | --

### 返回值

返回一个布尔值，表示是否符合判断条件

## Node.prototype.closest(selector: TSelector)

从当前节点开始，逐级向上查找最近的符合判断条件的节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | 判断条件 | √ | --

### 返回值

如果可以找到符合条件的节点，返回该节点，否则返回 null

### 备注

- 如果当前节点符合条件，会返回当前节点

## Node.prototype.toString()

将当前节点字符串化

### 参数

无

### 返回值

字符串化之后的结果
