# ParentNode

容器节点类，继承自 [Node 抽象类](node.md)，实现 [IParentNode 接口](types.md#iparentnode)

## new ParentNode(option: IParentNodeOption)

容器节点的构造函数

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
option | [IParentNodeOption](types.md#iparentnodeoption) | 配置项 | √ | --

## ParentNode.prototype.nodeType

允许的值为 NodeType.Tag | NodeType.Document | NodeType.DocumentFragment，查看[全部 NodeType](node-type.md)

## ParentNode.prototype.childNodes

子节点列表

## ParentNode.prototype.cloneNode()

创建当前节点的一个副本，但不会复制父节点和子节点列表

## ParentNode.prototype.appendChild(childNode: INode | INode[])

插入子节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | 要插入的子节点/子节点列表 | √ | --

### 返回值

返回一个布尔值，表示是否插入成功

### 备注

- 如果插入的是 DocumentFragment，会改为插入 DocumentFragment 的全部子节点，并将 DocumentFragment 的子节点列表清空
- 如果试图插入节点自身或祖先节点，会返回 false
- 如果 childNode 是节点数组，只要其中任何一个节点没有被成功插入，都会返回 false
- 如果插入的是已有的子节点，会改变该子节点的位置

## ParentNode.prototype.insertBefore(childNode: INode | INode[], previousTarget: INode)

插入节点到指定子节点之前

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | 要插入的子节点/子节点列表 | √ | --
previousTarget | [INode](types.md#inode) | 要插入到哪个子节点之前 | √ | --

### 返回值

返回一个布尔值，表示是否插入成功

### 备注

- 如果插入的是 DocumentFragment，会改为插入 DocumentFragment 的全部子节点，并将 DocumentFragment 的子节点列表清空
- 如果试图插入节点自身或祖先节点，会返回 false
- 如果 childNode 是节点数组，只要其中任何一个节点没有被成功插入，都会返回 false
- 如果插入的是已有的子节点，会改变该子节点的位置
- previousTarget 不是当前节点的子节点，会插入到当前节点列表的末尾

## ParentNode.prototype.replaceChild(newChild: INode | INode[], oldChild: INode)

替换子节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
newChild | [INode](types.md#inode)/INode[] | 要插入的子节点/子节点列表 | √ | --
oldChild | [INode](types.md#inode) | 要替换哪个子节点 | √ | --

### 返回值

如果 oldChild 被成功替换，会返回 oldChild。反之返回 null

### 备注

- 如果插入的是 DocumentFragment，会改为插入 DocumentFragment 的全部子节点，并将 DocumentFragment 的子节点列表清空
- 如果试图插入节点自身或祖先节点，会被忽略
- 如果 newChild 就是 oldChild，会被忽略
- 如果插入的是已有的子节点，会改变该子节点的位置
- oldChild 不是当前节点的子节点，会插入到当前节点列表的末尾

## ParentNode.prototype.removeChild(childNode: INode | INode[])

移除子节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
childNode | [INode](types.md#inode)/INode[] | 要移除的子节点/子节点列表 | √ | --

### 返回值

返回一个布尔值，表示 childNode 是否被成功移除

### 备注

- 如果 childNode 不是当前节点的子节点，它不会被移除，同时会返回 false
- 如果 childNode 是节点数组，只要其中任何一个节点没有被成功移除，都会返回 false

## ParentNode.prototype.querySelector(selector: TSelector)

查找符合条件的后代节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | 查询条件 | √ | --

### 返回值

如果可以查到相应节点，返回第一个匹配的节点，否则返回 null

### 备注

- 从当前节点的子节点开始递归查找

## ParentNode.prototype.querySelectorAll(selector: TSelector)

查找符合条件的后代节点

### 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
selector | [TSelector](types.md#tselector) | 查询条件 | √ | --

### 返回值

返回所有符合条件的节点列表，如果没有符合条件的节点，返回空数组

### 备注

- 从当前节点的子节点开始递归查找
