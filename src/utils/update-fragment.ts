import { IDocumentFragment, INode, IParentNode } from '../../typings/node';

/**
 * 将 documentFragment 的所有子节点插入到目标节点的准备工作
 * @param node 目标节点
 * @param fragment documentFragment
 */
export const updateFragment = (node: IParentNode, fragment: IDocumentFragment) => {
	const children: INode[] = fragment.childNodes.map(child => {
		child.parentNode = node;
		return child;
	});
	fragment.childNodes.length = 0;
	return children;
};
