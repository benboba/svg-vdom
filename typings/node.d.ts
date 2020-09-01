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
	selfClose?: boolean;
	textContent?: string;

	attributes?: IAttr[];
	childNodes?: INode[];

	parentNode?: INode;

	cloneNode(): INode;

	appendChild(childNode: INode): void;
	insertBefore(childNode: INode, previousTarget: INode): void;
	replaceChild(childNode: INode, ...children: INode[]): void;
	removeChild(childNode: INode): void;
	remove(): void;

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string | null;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): void;

	closest(selector: string | NodeType | TCheckFn): INode | null;
	matches(selector: string | NodeType | TCheckFn): boolean;
	querySelector(selector: string | NodeType | TCheckFn): INode | null;
	querySelectorAll(selector: string | NodeType | TCheckFn): INode[];
}

export interface ITag extends INode {
	nodeType: NodeType.Tag;
	childNodes: INode[];
	attributes: IAttr[];
	cloneNode(): ITag;
}

export interface IDocument extends INode {
	nodeType: NodeType.Document;
	childNodes: INode[];
	attributes: IAttr[];
	cloneNode(): IDocument;
}

export interface IText extends INode {
	nodeType: NodeType.Text | NodeType.CDATA | NodeType.Comments;
	childNodes: undefined;
	attributes: undefined;
	textContent: string;
}
