import { Stylesheet } from 'css';
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

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string | null;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): void;

	closest(selector: string | NodeType | TCheckFn): INode | null;
	matches(selector: string | NodeType | TCheckFn): boolean;
	querySelector(selector: string | NodeType | TCheckFn): INode | null;
	querySelectorAll(selector: string | NodeType | TCheckFn): INode[];
}

export interface ITagNode extends INode {
	childNodes: INode[];
	attributes: IAttr[];
	cloneNode(): ITagNode;
}

export interface IDomNode extends ITagNode {
	stylesheet?: Stylesheet;
	styletag?: ITagNode;
}

export interface ITextNode extends INode {
	childNodes: undefined;
	attributes: undefined;
	textContent: string;
}
