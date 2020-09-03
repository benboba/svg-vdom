import { Node } from '.';
import { IDocumentFragment, INode, IParentNode, ITextNode, TSelector } from '../../typings/node';
import { parseSelector } from '../selectors/parse';
import { getNodesByCondition } from '../utils/get-by-cond';
import { NodeType } from './node-type';

export interface IParentNodeOption {
	nodeName: IParentNode['nodeName'];
	nodeType: IParentNode['nodeType'];
	namespace?: IParentNode['namespace'];
}

export class ParentNode extends Node implements IParentNode {
	constructor(option: IParentNodeOption) {
		super(option);
		this.nodeType = option.nodeType;
		this.childNodes = [];
	}

	nodeType: IParentNode['nodeType'];
	childNodes: IParentNode['childNodes'];

	/**
	 * 复制自身，但是不复制节点树关系链
	 */
	cloneNode() {
		const cloneNode = new ParentNode({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
		});
		// 属性需要深拷贝
		return cloneNode;
	}

	/**
	 * 追加子节点
	 * @param childNode 要追加的节点
	 */
	appendChild(childNode: INode): boolean {
		// DocumentFragment 需要特殊处理
		if (childNode.nodeType === NodeType.DocumentFragment) {
			(childNode as IDocumentFragment).childNodes.forEach(child => {
				this.childNodes.push(child);
				child.parentNode = this;
			});
			(childNode as IDocumentFragment).childNodes.length = 0;
			return true;
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return false;
		}

		// 如果子节点原本有父节点，则先从原本的父节点中移除
		if (childNode.parentNode) {
			childNode.parentNode.removeChild(childNode);
		}
		this.childNodes.push(childNode);
		childNode.parentNode = this;
		return true;
	}

	/**
	 * 插入到子节点之前
	 * @param childNode 要插入的节点
	 * @param previousTarget 插入到哪个子字节之前
	 */
	insertBefore(childNode: INode, previousTarget: INode): boolean {
		const pIndex = this.childNodes.indexOf(previousTarget);

		// DocumentFragment 需要特殊处理
		if (childNode.nodeType === NodeType.DocumentFragment) {
			const children = (childNode as IDocumentFragment).childNodes;
			if (pIndex !== -1) {
				this.childNodes.splice(pIndex, 0, ...children);
			} else {
				this.childNodes.push(...children);
			}
			children.forEach(child => {
				child.parentNode = this;
			});
			(childNode as IDocumentFragment).childNodes.length = 0;
			return true;
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return false;
		}
		// 如果子节点原本有父节点，则先从原本的父节点中移除
		if (childNode.parentNode) {
			childNode.parentNode.removeChild(childNode);
		}
		// 判断目标节点是否在自己的子节点列表中，如果不在，直接插入
		if (pIndex !== -1) {
			this.childNodes.splice(pIndex, 0, childNode);
		} else {
			this.childNodes.push(childNode);
		}
		childNode.parentNode = this;
		return true;
	}

	/**
	 * 替换子节点
	 * @param newChild 新的子节点
	 * @param oldChild 要替换的旧节点
	 */
	replaceChild(newChild: INode, oldChild: INode): INode | null {
		const oIndex = this.childNodes.indexOf(oldChild);
		let returnVal: INode | null = null;

		// DocumentFragment 需要特殊处理
		if (newChild.nodeType === NodeType.DocumentFragment) {
			const children = (newChild as IDocumentFragment).childNodes;
			if (oIndex !== -1) {
				returnVal = oldChild;
				this.childNodes.splice(oIndex, 1, ...children);
			} else {
				this.childNodes.push(...children);
			}
			children.forEach(child => {
				child.parentNode = this;
			});
			(newChild as IDocumentFragment).childNodes.length = 0;
			return returnVal;
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === newChild)) {
			return returnVal;
		}
		// 先把要插入的子节点从原有父节点移除
		if (newChild.parentNode) {
			newChild.parentNode.removeChild(newChild);
		}
		// 指定父节点到自身
		newChild.parentNode = this;
		if (oIndex !== -1) {
			returnVal = oldChild;
			// 替换旧节点
			this.childNodes[oIndex] = newChild;
			// 清理旧节点的父节点指向
			delete oldChild.parentNode;
		} else {
			this.childNodes.push(newChild);
		}
		return returnVal;
	}

	/**
	 * 移除子节点
	 * @param childNode 要移除的子节点
	 */
	removeChild(childNode: INode): boolean {
		const index = this.childNodes.indexOf(childNode);
		if (index !== -1) {
			this.childNodes.splice(index, 1);
			delete childNode.parentNode;
			return true;
		}
		return false;
	}

	querySelector(selector: TSelector): IParentNode | ITextNode | null {
		const selectorGroups = typeof selector === 'string' ? parseSelector(selector) : selector;
		return getNodesByCondition(node => node.matches(selectorGroups), this, true)[0];
	}
	
	querySelectorAll(selector: TSelector): Array<IParentNode | ITextNode> {
		const selectorGroups = typeof selector === 'string' ? parseSelector(selector) : selector;
		return getNodesByCondition(node => node.matches(selectorGroups), this);
	}
}
