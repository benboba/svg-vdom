import { ISelector } from './style';

declare enum NodeType {
	Tag = 1,
	Text = 3,
	CDATA = 4,
	XMLDecl = 7,
	Comments = 8,
	Document = 9,
	DocType = 10,
	DocumentFragment = 11,
}

export interface IAttr {
	name: string;
	value: string;
	fullname: string;
	namespace?: string;
}

export type TCheckFn = (n: INode) => boolean;
export type TSelector = string | NodeType | TCheckFn | ISelector[][] | ISelector[] | ISelector;

export interface INodeOption {
	nodeName: INode['nodeName'];
	nodeType: INode['nodeType'];
	namespace?: INode['namespace'];
}

export interface IParentNodeOption extends INodeOption {
	nodeType: IParentNode['nodeType'];
}

export interface ITextNodeOption extends INodeOption {
	nodeType: ITextNode['nodeType'];
	textContent: ITextNode['textContent'];
}

export interface INode {
	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	parentNode?: IParentNode;

	cloneNode(): INode;
	remove(): boolean;
	toString(): string;

	closest(selector: TSelector): INode | null;
	matches(selector: TSelector): boolean;
}

export interface IParentNode extends INode {
	nodeType: NodeType.Tag | NodeType.Document | NodeType.DocumentFragment;
	childNodes: INode[];

	cloneNode(): IParentNode;

	appendChild(childNode: INode | INode[]): boolean;
	insertBefore(childNode: INode | INode[], previousTarget: INode): boolean;
	replaceChild(newChild: INode | INode[], oldChild: INode): INode | null;
	removeChild(childNode: INode | INode[]): boolean;

	querySelector(selector: TSelector): IParentNode | ITextNode | null;
	querySelectorAll(selector: TSelector): INode[];
}

export interface IDocument extends IParentNode {
	nodeType: NodeType.Document;
	cloneNode(): IDocument;
}

export interface IDocumentFragment extends IParentNode {
	nodeType: NodeType.DocumentFragment;
	parentNode: undefined;
	cloneNode(): IDocumentFragment;
}

export interface ITagNode extends IParentNode {
	nodeType: NodeType.Tag;
	attributes: IAttr[];

	cloneNode(): ITagNode;

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string | null;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): boolean;
}

export interface ITextNode extends INode {
	nodeType: NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType;
	textContent: string;
	cloneNode(): ITextNode;
}
