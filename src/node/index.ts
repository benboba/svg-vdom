import { ISelector } from 'typings/style';
import { INode, TSelector } from '../../typings/node';
import { matchSelector, matchSelectorGroups, matchSelectors } from '../selectors/match';
import { parseSelector } from '../selectors/parse';
import { stringifyNode } from '../stringify';

interface INodeOption {
	nodeName: INode['nodeName'];
	nodeType: INode['nodeType'];
	namespace?: INode['namespace'];
}

export abstract class Node implements INode {
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
	remove(): boolean {
		if (this.parentNode) {
			return this.parentNode.removeChild(this as INode);
		}
		return false;
	}

	/**
	 * 验证当前节点是否符合指定条件
	 * @param selector 处理函数 / 节点类型 / css 选择器
	 */
	matches(selector: TSelector): boolean {
		// 传入处理函数的情况
		if (typeof selector === 'function') {
			return selector(this);
		}

		// 传入节点类型的情况
		if (typeof selector === 'number') {
			return this.nodeType === selector;
		}

		// 传入 css 选择器的情况
		const selectorGroups = typeof selector === 'string' ? parseSelector(selector) : selector;
		if (Array.isArray(selectorGroups)) {
			if (Array.isArray(selectorGroups[0])) {
				return matchSelectorGroups(selectorGroups as ISelector[][], this);
			}
			return matchSelectors(selectorGroups as ISelector[], this);
		}
		return matchSelector(selectorGroups, this);
	}

	closest(selector: TSelector): INode | null {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let tag: INode | undefined = this;
		const selectorGroups = typeof selector === 'string' ? parseSelector(selector) : selector;
		while (tag) {
			if (tag.matches(selectorGroups)) {
				return tag;
			}
			tag = tag.parentNode;
		}
		return null;
	}

	toString(): string {
		return stringifyNode(this);
	}
}
