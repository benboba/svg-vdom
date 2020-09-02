import { NodeType } from '../src/node/node-type';

export interface IAttr {
	name: string;
	value: string;
	fullname: string;
	namespace?: string;
}

export type TCheckFn = (n: INode) => boolean;

export interface INode {
	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	parentNode?: IParentNode;

	cloneNode(): INode;
	remove(): void;

	closest(selector: string | NodeType | TCheckFn): INode | null;
	matches(selector: string | NodeType | TCheckFn): boolean;
}

export interface IParentNode extends INode {
	nodeType: NodeType.Tag | NodeType.Document;
	attributes: IAttr[];
	childNodes: INode[];

	cloneNode(): IParentNode;

	appendChild(childNode: INode): void;
	insertBefore(childNode: INode, previousTarget: INode): void;
	replaceChild(childNode: INode, ...children: INode[]): void;
	removeChild(childNode: INode): void;

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string | null;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): void;
	querySelector(selector: string | NodeType | TCheckFn): IParentNode | IText | null;
	querySelectorAll(selector: string | NodeType | TCheckFn): INode[];
}

export interface ITag extends IParentNode {
	nodeType: NodeType.Tag;
	cloneNode(): ITag;
}

export interface IDocument extends IParentNode {
	nodeType: NodeType.Document;
	cloneNode(): IDocument;
}

export interface IText extends INode {
	nodeType: NodeType.Text | NodeType.CDATA | NodeType.Comments | NodeType.XMLDecl | NodeType.DocType;
	textContent: string;
	cloneNode(): IText;
}
