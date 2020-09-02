import { IAttr, INode, IParentNode, IText, TCheckFn } from '../../typings/node';
import { matchBySelectors } from '../selectors/match';
import { parseSelectorGroup } from '../selectors/parse';
import { getNodesByCondition } from '../utils/get-by-cond';
import { NodeType } from './node-type';

interface INodeOption {
	nodeName: INode['nodeName'];
	nodeType: INode['nodeType'];
	namespace?: INode['namespace'];
}

abstract class Node implements INode {
	constructor(option: INodeOption) {
		this.nodeName = option.nodeName;
		this.nodeType = option.nodeType;
		this.namespace = option.namespace;
	}

	nodeName: INode['nodeName'];
	nodeType: INode['nodeType'];
	namespace?: INode['namespace'];
	parentNode?: INode['parentNode'];

	/**
	 * 复制自身，但是不复制节点树关系链
	 */
	abstract cloneNode(): INode;

	/**
	 * 移除当前节点
	 */
	remove(): void {
		if (this.parentNode) {
			this.parentNode.removeChild(this as INode);
		}
	}

	/**
	 * 验证当前节点是否符合指定条件
	 * @param selector 处理函数 / 节点类型 / css 选择器
	 */
	matches(selector: string | NodeType | TCheckFn): boolean {
		// 传入处理函数的情况
		if (typeof selector === 'function') {
			return selector(this);
		}

		// 传入节点类型的情况
		if (typeof selector === 'number') {
			return this.nodeType === selector;
		}

		// 传入 css 选择器的情况
		const selectorGroups = parseSelectorGroup(selector);
		return matchBySelectors(selectorGroups, this);
	}

	closest(selector: string | NodeType | TCheckFn): INode | null {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let tag: INode | undefined = this;
		while (tag) {
			if (tag.matches(selector)) {
				return tag;
			}
			tag = tag.parentNode;
		}
		return null;
	}
}

export interface ITextNodeOption {
	nodeName: IText['nodeName'];
	nodeType: IText['nodeType'];
	namespace?: IText['namespace'];
	textContent: IText['textContent'];
}

export class TextNode extends Node implements IText {
	constructor(option: ITextNodeOption) {
		super(option);
		this.nodeType = option.nodeType;
		this.textContent = option.textContent;
	}

	textContent: IText['textContent'];
	nodeType: IText['nodeType'];

	cloneNode() {
		const cloneNode = new TextNode({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
			textContent: this.textContent,
		});
		return cloneNode;
	}
}

export interface IParentNodeOption {
	nodeName: IParentNode['nodeName'];
	nodeType: IParentNode['nodeType'];
	namespace?: IParentNode['namespace'];
}

export class ParentNode extends Node implements IParentNode {
	constructor(option: IParentNodeOption) {
		super(option);
		this.nodeType = option.nodeType;
		this.attributes = [];
		this.childNodes = [];
	}

	nodeType: IParentNode['nodeType'];
	attributes: IParentNode['attributes'];
	childNodes: IParentNode['childNodes'];

	/**
	 * 复制自身，但是不复制节点树关系链
	 */
	cloneNode() {
		const cloneNode: IParentNode = new ParentNode({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
		});
		// 属性需要深拷贝
		cloneNode.attributes = this.attributes.map(attr => ({ ...attr }));
		return cloneNode;
	}

	/**
	 * 追加子节点
	 * @param childNode 要追加的节点
	 */
	appendChild(childNode: INode): void {
		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return;
		}
		// 如果子节点原本有父节点，则先从原本的父节点中移除
		if (childNode.parentNode) {
			childNode.parentNode.removeChild(childNode);
		}
		this.childNodes.push(childNode);
		childNode.parentNode = this;
	}

	/**
	 * 插入到子节点之前
	 * @param childNode 要插入的节点
	 * @param previousTarget 插入到哪个子字节之前
	 */
	insertBefore(childNode: INode, previousTarget: INode): void {
		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return;
		}
		// 如果子节点原本有父节点，则先从原本的父节点中移除
		if (childNode.parentNode) {
			childNode.parentNode.removeChild(childNode);
		}
		// 判断目标节点是否在自己的子节点列表中，如果不在，直接插入
		const pindex = this.childNodes.indexOf(previousTarget);
		if (pindex !== -1) {
			this.childNodes.splice(pindex, 0, childNode);
		} else {
			this.childNodes.push(childNode);
		}
		childNode.parentNode = this;
	}

	/**
	 * 替换子节点
	 * @param oldChild 要替换掉哪个节点
	 * @param newChildren 用来替换的节点列表
	 * TODO 参数顺序有点问题
	 */
	replaceChild(oldChild: INode, ...newChildren: INode[]): void {
		const targets = newChildren.filter(child => {
			// 自身/祖先元素不能被追加
			if (this.closest(node => node === child)) {
				return false;
			}
			// 先把要插入的子节点从原有父节点移除
			if (child.parentNode) {
				child.parentNode.removeChild(child);
			}
			// 指定父节点到自身
			child.parentNode = this;
			return true;
		});
		const index = this.childNodes.indexOf(oldChild);
		if (index !== -1) {
			this.childNodes.splice(index, 1, ...targets);
			// 清理被替换掉的子节点的钩子
			delete oldChild.parentNode;
		} else {
			this.childNodes.push(...targets);
		}
	}

	/**
	 * 移除子节点
	 * @param childNode 要移除的子节点
	 */
	removeChild(childNode: INode): void {
		const index = this.childNodes.indexOf(childNode);
		if (index !== -1) {
			this.childNodes.splice(index, 1);
			delete childNode.parentNode;
		}
	}

	/**
	 * 是否存在属性
	 * @param name 属性名
	 * @param namespace 属性命名空间
	 */
	hasAttribute(name: string, namespace?: string): boolean {
		for (const attr of this.attributes) {
			if (!namespace) {
				if (attr.fullname === name) {
					return true;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 获取属性
	 * @param name 属性名
	 * @param namespace 属性命名空间
	 */
	getAttribute(name: string, namespace?: string): string | null {
		for (const attr of this.attributes) {
			if (!namespace) {
				if (attr.fullname === name) {
					return attr.value;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					return attr.value;
				}
			}
		}
		return null;
	}

	/**
	 * 设置属性
	 * @param name 属性名
	 * @param value 属性值
	 * @param namespace 属性命名空间
	 */
	setAttribute(name: string, value: string, namespace?: string): void {
		for (const attr of this.attributes) {
			if (!namespace) {
				if (attr.fullname === name) {
					attr.value = value;
					return;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					attr.value = value;
					return;
				}
			}
		}

		const newAttr: IAttr = {
			name,
			value,
			fullname: name,
		};
		if (namespace) {
			newAttr.fullname = `${namespace}:${name}`;
			newAttr.namespace = namespace;
		}
		this.attributes.push(newAttr);
	}

	/**
	 * 移除属性
	 * @param name 属性名
	 * @param namespace 属性命名空间
	 */
	removeAttribute(name: string, namespace?: string): void {
		for (let i = this.attributes.length; i--;) {
			const attr = this.attributes[i];
			if (!namespace) {
				if (attr.fullname === name) {
					this.attributes.splice(i, 1);
					return;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					this.attributes.splice(i, 1);
					return;
				}
			}
		}
	}

	querySelector(selector: string | NodeType | TCheckFn): IParentNode | IText | null {
		return getNodesByCondition(node => node.matches(selector), this, true)[0];
	}
	
	querySelectorAll(selector: string | NodeType | TCheckFn): Array<IParentNode | IText> {
		return getNodesByCondition(node => node.matches(selector), this);
	}
}
