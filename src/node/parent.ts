import { Node } from '.';
import { IDocumentFragment, INode, IParentNode, IParentNodeOption, ITextNode, TSelector, ITagNode } from '../../typings/node';
import { parseSelector } from '../selectors/parse';
import { getNodesByCondition } from '../utils/get-by-cond';
import { updateFragment } from '../utils/update-fragment';
import { NodeType } from './node-type';

export class ParentNode extends Node implements IParentNode {
	constructor(option: IParentNodeOption) {
		super(option);
		this.nodeType = option.nodeType;
		this.childNodes = [];
	}

	nodeType: IParentNode['nodeType'];
	childNodes: IParentNode['childNodes'];

	get children(): ITagNode[] {
		const children: ITagNode[] = [];
		for (const child of this.childNodes) {
			if (child.nodeType === NodeType.Tag) {
				children.push(child as ITagNode);
			}
		}
		return children;
	}

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
	appendChild(childNode: INode | INode[]): boolean {
		if (Array.isArray(childNode)) {
			return [...childNode].reduce((prev: boolean, child) => this.appendChild(child) && prev, true);
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return false;
		}

		// DocumentFragment 需要特殊处理
		if (childNode.nodeType === NodeType.DocumentFragment) {
			const children = updateFragment(this, childNode as IDocumentFragment);
			this.childNodes.push(...children);
			return true;
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
	insertBefore(childNode: INode | INode[], previousTarget: INode): boolean {
		if (Array.isArray(childNode)) {
			return [...childNode].reduce((prev: boolean, child) => this.insertBefore(child, previousTarget) && prev, true);
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === childNode)) {
			return false;
		}

		// DocumentFragment 需要特殊处理
		if (childNode.nodeType === NodeType.DocumentFragment) {
			const pIndex = this.childNodes.indexOf(previousTarget);
			const children = updateFragment(this, childNode as IDocumentFragment);
			if (pIndex !== -1) {
				this.childNodes.splice(pIndex, 0, ...children);
			} else {
				this.childNodes.push(...children);
			}
			return true;
		}

		// 子元素自身插入到自身之前的问题
		if (childNode === previousTarget && childNode.parentNode === this) {
			return true;
		}

		// 如果子节点原本有父节点，则先从原本的父节点中移除
		childNode.remove();

		// pIndex 的获取要在 childNode 被移除之后，避免 childNode 就是当前节点的子节点，导致 pIndex 被意外更新
		const pIndex = this.childNodes.indexOf(previousTarget);

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
	replaceChild(newChild: INode | INode[], oldChild: INode): INode | null {
		let returnVal: INode | null = null;

		if (Array.isArray(newChild)) {
			const children = new Set<INode>();
			// 用于标记是否存在自身替换自身的情况
			let replaceSize = 1;
			let oIndex = this.childNodes.indexOf(oldChild);
			[...newChild].forEach(child => {
				// 自身/祖先元素不能被追加
				if (this.closest(node => node === child)) {
					return;
				}

				if (child.nodeType === NodeType.DocumentFragment) {
					updateFragment(this, child as IDocumentFragment).forEach(n => {
						children.add(n);
					});
					return;
				}

				// 子元素自身替换自身的问题
				if (child.parentNode === this) {
					const cIndex = this.childNodes.indexOf(child);
					if (cIndex !== -1 && cIndex < oIndex) {
						oIndex--;
					} else if (child === oldChild) {
						replaceSize = 0;
					}
				}
				child.remove();
				child.parentNode = this;
				children.add(child);
			});
			if (oIndex !== -1) {
				returnVal = replaceSize ? oldChild : null;
				this.childNodes.splice(oIndex, replaceSize, ...children);
				if (returnVal) {
					// 清理旧节点的父节点指向
					delete oldChild.parentNode;
				}
			} else {
				this.childNodes.push(...children);
			}
			return returnVal;
		}

		// 自身/祖先元素不能被追加
		if (this.closest(node => node === newChild)) {
			return returnVal;
		}

		// DocumentFragment 需要特殊处理
		if (newChild.nodeType === NodeType.DocumentFragment) {
			const oIndex = this.childNodes.indexOf(oldChild);
			const children = updateFragment(this, newChild as IDocumentFragment);
			if (oIndex !== -1) {
				returnVal = oldChild;
				this.childNodes.splice(oIndex, 1, ...children);
				// 清理旧节点的父节点指向
				delete oldChild.parentNode;
			} else {
				this.childNodes.push(...children);
			}
			return returnVal;
		}

		// 子元素自身替换自身的问题
		if (newChild === oldChild && newChild.parentNode === this) {
			return null;
		}

		// 先把要插入的子节点从原有父节点移除
		newChild.remove();
		// 指定父节点到自身
		newChild.parentNode = this;

		// oIndex 的获取要在 newChild 被移除之后，避免 newChild 就是当前节点的子节点，导致 oIndex 被意外更新
		const oIndex = this.childNodes.indexOf(oldChild);

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
	removeChild(childNode: INode | INode[]): boolean {
		if (Array.isArray(childNode)) {
			return [...childNode].reduce((prev: boolean, child) => this.removeChild(child) && prev, true);
		}
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
		return getNodesByCondition(node => node.matches(selectorGroups, this), this, true)[0] ?? null;
	}
	
	querySelectorAll(selector: TSelector): Array<IParentNode | ITextNode> {
		const selectorGroups = typeof selector === 'string' ? parseSelector(selector) : selector;
		return getNodesByCondition(node => node.matches(selectorGroups, this), this);
	}
}
