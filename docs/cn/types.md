# 类型一览

## IAttrSelector

属性选择器，其中 attrModifier 是枚举类型，[查看详情](attr-modifier.md)

```typescript
interface IAttrSelector {
	key: string; // 属性名
	modifier?: attrModifier; // 等号修饰符
	value?: string; // 属性值
}
```

## IPseudo

伪类/伪元素选择器

```typescript
interface IPseudo {
	func: string; // 伪类/伪元素的名称
	isClass: boolean; // 是否为伪类的标识符
	value?: string; // 函数类型的伪类/伪元素的值
}
```

## ISelector

选择器单元，其中 selectorUnitCombinator 是枚举类型，[查看详情](attr-modifier.md)

```typescript
interface ISelector {
	universal?: boolean; // 通配符
	type?: string; // 标签选择器
	id: string[]; // id 选择器列表
	class: string[]; // 类选择器列表
	attr: IAttrSelector[]; // 属性选择器列表
	pseudo: IPseudo[]; // 伪类/伪元素选择器列表
	combinator?: selectorUnitCombinator; // 与后一个选择器单元的组合方式（相邻兄弟选择器、兄弟选择器、子选择）
}
```

## TCheckFn

验证函数

```typescript
type TCheckFn = (n: INode) => boolean;
```

## TSelector

可用于 matches 和 querySelector 的验证规则

```typescript
type TSelector =
    string // 使用 CSS 选择器字符串验证
    | NodeType // 使用节点类型验证
    | TCheckFn // 使用验证函数验证
    | ISelector[][] // 使用 CSS 选择器分组验证
    | ISelector[] // 使用 CSS 选择器验证
    | ISelector; // 使用 CSS 选择器单元验证
```

其中 string 类型允许以 “>” 开始

## IAttr

标签类节点的属性

```typescript
interface IAttr {
	name: string; // 属性名称
	value: string; // 属性值
	fullname: string; // 属性全名，如果有 namespace，格式为`${namespace}:${name}`，否则与 name 相同
	namespace?: string; // 属性的命名空间
}
```

## INode

基本节点类型

```typescript
interface INode {
	nodeName: string; // 节点名称
	nodeType: NodeType; // 节点类型
	namespace?: string; // 节点命名空间
	parentNode?: IParentNode; // 父节点

	cloneNode(): INode; // 创建当前节点的副本
	remove(): boolean; // 移除自身
	toString(): string; // 字符串化

	closest(selector: TSelector): INode | null; // 查找最近的符合条件的祖先节点（含自身）
	matches(selector: TSelector, finder?: IParentNode): boolean; // 判断自身是否符合条件
}
```

## INodeOption

基本节点类型的构造函数参数

```typescript
interface INodeOption {
	nodeName: INode['nodeName']; // 节点名称
	nodeType: INode['nodeType']; // 节点类型
    namespace?: INode['namespace']; // 节点命名空间（可选）
}
```

## IParentNode

容器节点类型

```typescript
interface IParentNode extends INode {
	nodeType: NodeType.Tag | NodeType.Document | NodeType.DocumentFragment; // 节点类型
	childNodes: INode[]; // 子节点列表

	cloneNode(): IParentNode; // 创建当前节点的副本（不会递归复制子节点）

	appendChild(childNode: INode | INode[]): boolean; // 在末尾插入子节点
	insertBefore(childNode: INode | INode[], previousTarget: INode): boolean; // 插入到某个子节点之前
	replaceChild(newChild: INode | INode[], oldChild: INode): INode | null; // 替换某个子节点
	removeChild(childNode: INode | INode[]): boolean; // 移除子节点

	querySelector(selector: TSelector): IParentNode | ITextNode | null;
	querySelectorAll(selector: TSelector): INode[];
}
```

## IParentNodeOption

容器节点类型的构造函数参数

```typescript
interface IParentNodeOption extends INodeOption {
	nodeType: IParentNode['nodeType']; // 节点类型
}
```

## IDocument

document 类型

```typescript
interface IDocument extends IParentNode {
	nodeType: NodeType.Document; // 节点类型
	cloneNode(): IDocument; // 创建当前节点的副本（不会递归复制子节点）
}
```

## IDocumentFragment

文档碎片类型

```typescript
interface IDocumentFragment extends IParentNode {
	nodeType: NodeType.DocumentFragment; // 节点类型
	parentNode: undefined; // 文档碎片不会有父节点
	cloneNode(): IDocumentFragment; // 创建当前节点的副本（不会递归复制子节点）
}
```

## ITagNode

标签节点类型

```typescript
interface ITagNode extends IParentNode {
	nodeType: NodeType.Tag; // 节点类型
	attributes: IAttr[]; // 属性列表
    cloneNode(): ITagNode; // 创建当前节点的副本，同时复制属性列表（不会递归复制子节点）

	hasAttribute(name: string, namespace?: string): boolean; // 判断是否具有指定属性
	getAttribute(name: string, namespace?: string): string | null; // 获取指定属性
	setAttribute(name: string, value: string, namespace?: string): void; // 设置指定属性
	removeAttribute(name: string, namespace?: string): boolean; // 移除指定属性
}
```

## ITextNode

文本节点类型

```typescript
interface ITextNode extends INode {
	nodeType: NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType; // 节点类型
	textContent: string; // 节点的文本内容
	cloneNode(): ITextNode; // 创建当前节点的副本，同时复制文本内容
}
```

## ITextNodeOption

文本节点的构造函数参数

```typescript
interface ITextNodeOption extends INodeOption {
	nodeType: ITextNode['nodeType']; // 节点类型
	textContent: ITextNode['textContent']; // 节点的文本内容
}
```
