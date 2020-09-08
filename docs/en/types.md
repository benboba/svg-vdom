# Type list

## IAttrSelector

Attribute selector, where attrModifier is an enumerated type, [view details](attr-modifier.md)

```typescript
interface IAttrSelector {
	key: string; // Attribute name
	modifier?: attrModifier; // Modifier of equal sign
	value?: string; // Attribute value
}
```

## IPseudo

Pseudo class/pseudo element selector

```typescript
interface IPseudo {
	func: string; // Pseudo-class/pseudo-element name
	isClass: boolean; // Whether it is a pseudo-class
	value?: string; // Value of function type pseudo-class/pseudo-element
}
```

## ISelector

Selector unit, where selectorUnitCombinator is an enumerated type, [view details](attr-modifier.md)

```typescript
interface ISelector {
	universal?: boolean; // Wildcard
	type?: string; // Tag selector
	id: string[]; // ID selector list
	class: string[]; // Class selector list
	attr: IAttrSelector[]; // Attribute selector list
	pseudo: IPseudo[]; // List of pseudo-classes/pseudo-element selectors
	combinator?: selectorUnitCombinator; // Combination with the latter selector unit (neighbor sibling selector, sibling selector, child selector)
}
```

## TCheckFn

Verification function

```typescript
type TCheckFn = (n: INode) => boolean;
```

## TSelector

Validation rules that can be used for matches and querySelector

```typescript
type TSelector =
    string // Use CSS selector string validation
    | NodeType // Use node type verification
    | TCheckFn // Use verification function to verify
    | ISelector[][] // Use CSS selector groups to validate
    | ISelector[] // Use CSS selector to validate
    | ISelector; // Use CSS selector unit to validate
```

## IAttr

Properties of label nodes

```typescript
interface IAttr {
	name: string; // Attribute name
	value: string; // Attribute value
	fullname: string; // The full name of the attribute, if there is a namespace, the format is `${namespace}:${name}`, otherwise the same as name
	namespace?: string; // Attribute namespace
}
```

## INode

Basic node type

```typescript
interface INode {
	nodeName: string; // Node name
	nodeType: NodeType; // Node type
	namespace?: string; // Node namespace
	parentNode?: IParentNode; // Parent node

	cloneNode(): INode; // Create a copy of the current node
	remove(): boolean; // Remove itself
	toString(): string; // Stringified

	closest(selector: TSelector): INode | null; // Find the nearest eligible ancestor node (including itself)
	matches(selector: TSelector): boolean; // Determine whether the current node meets the conditions
}
```

## INodeOption

Constructor parameters for basic node types

```typescript
interface INodeOption {
	nodeName: INode['nodeName']; // Node name
	nodeType: INode['nodeType']; // Node type
    namespace?: INode['namespace']; // Node namespace
}
```

## IParentNode

Container node type

```typescript
interface IParentNode extends INode {
	nodeType: NodeType.Tag | NodeType.Document | NodeType.DocumentFragment; // Node type
	childNodes: INode[]; // Child node list

	cloneNode(): IParentNode; // Create a copy of the current node(The child node and parent node will not be copied)

	appendChild(childNode: INode | INode[]): boolean; // Insert child node at the end
	insertBefore(childNode: INode | INode[], previousTarget: INode): boolean; // Insert before a child node
	replaceChild(newChild: INode | INode[], oldChild: INode): INode | null; // Replace a child node
	removeChild(childNode: INode | INode[]): boolean; // Remove a child node

	querySelector(selector: TSelector): IParentNode | ITextNode | null;
	querySelectorAll(selector: TSelector): INode[];
}
```

## IParentNodeOption

Constructor parameters of the container node type

```typescript
interface IParentNodeOption extends INodeOption {
	nodeType: IParentNode['nodeType']; // Node type
}
```

## IDocument

Document type

```typescript
interface IDocument extends IParentNode {
	nodeType: NodeType.Document; // Node type
	cloneNode(): IDocument; // Create a copy of the current node(The child node and parent node will not be copied)
}
```

## IDocumentFragment

Document fragment type

```typescript
interface IDocumentFragment extends IParentNode {
	nodeType: NodeType.DocumentFragment; // Node type
	parentNode: undefined; // Document fragments will not have a parent node
	cloneNode(): IDocumentFragment; // Create a copy of the current node(The child node and parent node will not be copied)
}
```

## ITagNode

Tag node type

```typescript
interface ITagNode extends IParentNode {
	nodeType: NodeType.Tag; // Node type
	attributes: IAttr[]; // Attribute list
    cloneNode(): ITagNode; // Create a copy of the current node, copy the attribute list at the same time(The child node and parent node will not be copied)

	hasAttribute(name: string, namespace?: string): boolean; // Determine whether it has specified attributes
	getAttribute(name: string, namespace?: string): string | null; // Get attribute
	setAttribute(name: string, value: string, namespace?: string): void; // Set attribute
	removeAttribute(name: string, namespace?: string): boolean; // Remove attribute
}
```

## ITextNode

Text node type

```typescript
interface ITextNode extends INode {
	nodeType: NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType; // Node type
	textContent: string; // The text content of the node
	cloneNode(): ITextNode; // Create a copy of the current node, copy the text content of the node at the same time
}
```

## ITextNodeOption

Constructor parameters for text nodes

```typescript
interface ITextNodeOption extends INodeOption {
	nodeType: ITextNode['nodeType']; // Node type
	textContent: ITextNode['textContent']; // The text content of the node
}
```
