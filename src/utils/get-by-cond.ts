/*
 * 递归遍历所有的 Node 后代节点，并对符合条件的节点执行操作
 */

import { INode, IParentNode, IText, TCheckFn } from '../../typings/node';
import { NodeType } from '../node/node-type';

const traversal = <T extends INode = IParentNode | IText>(condition: TCheckFn, node: INode | IParentNode | IText, breakImmediate: boolean, result: T[]): T[] => {
	// 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	if (node.nodeType === NodeType.Tag || node.nodeType === NodeType.Document) {
		for (let i = 0; i < (node as IParentNode).childNodes.length; i++) {
			const childNode = (node as IParentNode).childNodes[i];
			if (condition(childNode)) {
				result.push(childNode as T);
				if (breakImmediate) {
					break;
				}
			}
			traversal(condition, childNode, breakImmediate, result);
			if (breakImmediate && result.length) {
				break;
			}
		}
	}
	return result;
};

/**
 * @param condition 判断条件
 * @param node 起始节点（起始节点不参与判断）
 * @param breakImmediate 设置为 true 表示找到第一个符合条件的元素即中断
 */
export const getNodesByCondition = <T extends INode = IParentNode | IText>(condition: TCheckFn, node: INode, breakImmediate = false): T[] => {
	return traversal(condition, node, breakImmediate, []);
};
