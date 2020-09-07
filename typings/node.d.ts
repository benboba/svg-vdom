import { NodeType } from '../src/node/node-type';
import { ISelector } from './style';

export interface IAttr {
	name: string;
	value: string;
	fullname: string;
	namespace?: string;
}

export type TCheckFn = (n: INode) => boolean;
export type TSelector = string | NodeType | TCheckFn | ISelector[][] | ISelector[] | ISelector;

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

	appendChild(childNode: INode): boolean;
	insertBefore(childNode: INode, previousTarget: INode): boolean;
	replaceChild(newChild: INode, oldChild: INode): INode | null;
	removeChild(childNode: INode): boolean;

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
