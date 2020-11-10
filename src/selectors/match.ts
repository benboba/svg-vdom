import { INode, IParentNode, ITagNode } from '../../typings/node';
import { ISelector } from '../../typings/style';
import { NodeType } from '../node/node-type';
import { attrModifier, selectorUnitCombinator, validPseudoElement } from './define';
import { checkNTH, parseNTH } from './nth';
import { parseSelector } from './parse';

// 验证 className
const checkClass = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	const classAttr = (node as ITagNode).getAttribute('class');
	let classNames: string[] = [];
	if (classAttr) {
		classNames = classAttr.trim().split(/\s+/);
	}
	return selector.class.every(className => classNames.includes(className));
};

// 验证 ID
const checkID = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	let id = (node as ITagNode).getAttribute('id');
	if (id) {
		id = id.trim();
	}
	return selector.id.every(_id => _id === id);
};

// 验证属性
const checkAttr = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	for (let ai = selector.attr.length; ai--;) {
		const attrSelector = selector.attr[ai];
		let attr = (node as ITagNode).getAttribute(attrSelector.key);
		if (attr === null) {
			return false;
		} else if (attrSelector.value) {
			// 属性值大小写不敏感
			const value = attrSelector.value.trim().toLowerCase();
			attr = attr.trim().toLowerCase();
			switch (attrSelector.modifier) {
				// 开始字符匹配
				case attrModifier['^']:
					if (attr.indexOf(value) !== 0) {
						return false;
					}
					break;
				// 结尾字符匹配
				case attrModifier['$']:
					if (attr.lastIndexOf(value) !== attr.length - value.length) {
						return false;
					}
					break;
				// 空格分组字符匹配
				case attrModifier['~']:
					if (!attr.split(/\s+/).includes(value)) {
						return false;
					}
					break;
				// 前缀字符匹配
				case attrModifier['|']:
					if (attr !== value && attr.indexOf(`${value}-`) !== 0) {
						return false;
					}
					break;
				// 模糊匹配
				case attrModifier['*']:
					if (!attr.includes(value)) {
						return false;
					}
					break;
				// 默认全字匹配
				default:
					if (attr !== value) {
						return false;
					}
					break;
			}
		}
	}
	return true;
};

// 验证伪类和伪元素
// 部分伪类可以直接通过验证，部分伪类需要进一步验证，个别在特定列表里的伪元素需要符合条件才能通过验证
// 目前支持到 CSS-selectors-3 https://www.w3.org/TR/selectors-3/
const checkPseudo = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	for (let pi = selector.pseudo.length; pi--;) {
		const pseudoSelector = selector.pseudo[pi];
		// 只在命中特定的伪元素时，验证作用域链上是否存在文本节点 text
		if (validPseudoElement.includes(pseudoSelector.func)) {
			let hasText = false;
			if (node.nodeName === 'text') {
				hasText = true;
			} else {
				if ((node as ITagNode).querySelector('text')) {
					hasText = true;
				}
			}
			if (!hasText) {
				return false;
			}
		} else if (pseudoSelector.isClass) {
			switch (pseudoSelector.func) {
				case 'empty': // 自身没有子标签
					return (node as ITagNode).children.length === 0;

				case 'first-child': // 自身是父元素的第一个子标签
					if (node.parentNode) {
						return node.parentNode.children[0] === node;
					}
					return false;

				case 'last-child':
					if (node.parentNode) {
						const children = node.parentNode.children;
						return children[children.length - 1] === node;
					}
					return false;

				case 'only-child': // 自身是父元素唯一的子标签
					if (node.parentNode) {
						return node.parentNode.children.length === 1;
					}
					return false;

				case 'nth-child': // 自身是父元素唯一的子标签
					if (node.parentNode && pseudoSelector.value) {
						const [a, b, ofS] = parseNTH(pseudoSelector.value);
						let children = node.parentNode.children;
						if (ofS) {
							children = children.filter(c => c.matches(ofS));
						}
						return checkNTH(node as ITagNode, children, a, b);
					}
					return false;

				case 'nth-last-child': // 自身是父元素唯一的子标签
					if (node.parentNode && pseudoSelector.value) {
						const [a, b, ofS] = parseNTH(pseudoSelector.value);
						let children = node.parentNode.children.reverse();
						if (ofS) {
							children = children.filter(c => c.matches(ofS));
						}
						return checkNTH(node as ITagNode, children, a, b);
					}
					return false;

				case 'first-of-type': // 自身是父元素第一个同类型子元素
					if (node.parentNode) {
						return node.parentNode.querySelectorAll(node.nodeName)[0] === node;
					}
					return false;

				case 'last-of-type': // 自身是父元素最后一个同类型子元素
					if (node.parentNode) {
						const typeChildren = node.parentNode.querySelectorAll(node.nodeName);
						return typeChildren[typeChildren.length - 1] === node;
					}
					return false;

				case 'only-of-type': // 自身是父元素唯一的同类型子元素
					if (node.parentNode) {
						return node.parentNode.querySelectorAll(node.nodeName).length === 1;
					}
					return false;

				case 'nth-of-type': // 自身是父元素唯一的子标签
					if (node.parentNode && pseudoSelector.value) {
						const [a, b, ofS] = parseNTH(pseudoSelector.value);
						let typeChildren = node.parentNode.querySelectorAll(node.nodeName) as ITagNode[];
						if (ofS) {
							typeChildren = typeChildren.filter(c => c.matches(ofS));
						}
						return checkNTH(node as ITagNode, typeChildren, a, b);
					}
					return false;

				case 'nth-last-of-type': // 自身是父元素唯一的子标签
					if (node.parentNode && pseudoSelector.value) {
						const [a, b, ofS] = parseNTH(pseudoSelector.value);
						let typeChildren = (node.parentNode.querySelectorAll(node.nodeName) as ITagNode[]).reverse();
						if (ofS) {
							typeChildren = typeChildren.filter(c => c.matches(ofS));
						}
						return checkNTH(node as ITagNode, typeChildren, a, b);
					}
					return false;

				case 'target': // 只有具备 id 或 name 属性的元素才可能被命中
					return (node as ITagNode).hasAttribute('id') || (node as ITagNode).hasAttribute('name');

				case 'not': // not 伪类需要反转规则，匹配不能命中 pseudoSelector.value 的元素，如果 pseudoSelector.value 解析失败，也返回 false
					if (pseudoSelector.value) {
						const selectors = parseSelector(pseudoSelector.value);
						if (selectors.length) {
							return !node.matches(selectors);
						}
					}
					return false;

				case 'lang': // 语言，命中系统语言或 lang="" 属性，因为不能判断系统语言，因此直接返回 true
				case 'link': // CSS2 伪类，可命中任意元素
				case 'visited': // CSS2 伪类，可命中任意元素
				case 'hover': // CSS2 伪类，可命中任意元素
				case 'active': // CSS2 伪类，可命中任意元素
				case 'focus': // CSS2 伪类，可命中任意元素
					return true;

				default: // 其它伪类暂不进行验证，默认返回 false
					return false;
			}
		} else {
			return false;
		}
	}
	return true;
};

// 验证 selector 和 node 是否匹配
export const matchSelector = (selector: ISelector, node: INode): boolean => {
	// 如果存在标签，则标签必须符合
	if (selector.type && selector.type !== node.nodeName) {
		return false;
	}

	// 如果存在 class 选择器，则每个 class 都要匹配
	if (selector.class.length) {
		if (!checkClass(node, selector)) {
			return false;
		}
	}

	// 如果存在 id 选择器，则每个 id 都要匹配
	if (selector.id.length) {
		if (!checkID(node, selector)) {
			return false;
		}
	}

	if (selector.attr.length) {
		if (!checkAttr(node, selector)) {
			return false;
		}
	}

	if (selector.pseudo.length) {
		if (!checkPseudo(node, selector)) {
			return false;
		}
	}

	return true;
};

export const matchSelectors = (selectors: ISelector[], node: INode, finder?: IParentNode) => {
	const selectorsLength = selectors.length;
	if (!selectorsLength) return false;
	if (!matchSelector(selectors[selectorsLength - 1], node)) return false;
	let currentNode: INode = node;
	let currentSelectorIndex = selectorsLength - 2;
	while (currentSelectorIndex >= 0) {
		switch (selectors[currentSelectorIndex].combinator) {
			// finder 的子元素
			case selectorUnitCombinator['&>']:
				if (currentNode.parentNode === finder) {
					break;
				}
				return false;
			// 子选择器
			case selectorUnitCombinator['>']:
				if (currentNode.parentNode) {
					if (!matchSelector(selectors[currentSelectorIndex], currentNode.parentNode)) {
						return false;
					}
					currentNode = currentNode.parentNode;
					break;
				}
				return false;
				// 相邻兄弟选择器
			case selectorUnitCombinator['+']:
				if (currentNode.parentNode) {
					const brothers = currentNode.parentNode.childNodes;
					let nodeIndex = brothers.indexOf(currentNode);
					let brother: ITagNode | undefined;
					while (nodeIndex > 0) {
						if (brothers[nodeIndex - 1].nodeType === NodeType.Tag) {
							brother = brothers[nodeIndex - 1] as ITagNode;
							break;
						}
						nodeIndex--;
					}
					if (!brother || !matchSelector(selectors[currentSelectorIndex], brother)) {
						return false;
					}
					currentNode = brothers[nodeIndex - 1];
					break;
				}
				return false;
				// 兄弟选择器
			case selectorUnitCombinator['~']:
				if (currentNode.parentNode) {
					const _brothers = currentNode.parentNode.childNodes;
					const index = _brothers.indexOf(currentNode);
					if (index <= 0) {
						return false;
					}
					let _brother: ITagNode | undefined;
					for (let bi = index; bi--;) {
						if (_brothers[bi].nodeType === NodeType.Tag) {
							_brother = _brothers[bi] as ITagNode;
							if (matchSelector(selectors[currentSelectorIndex], _brother)) {
								currentNode = _brother;
								break;
							}
						}
					}
					if (currentNode !== _brother) {
						return false;
					}
					break;
				}
				return false;
				// 后代选择器
			default: {
				let parent = currentNode.parentNode;
				while (parent) {
					if (matchSelector(selectors[currentSelectorIndex], parent)) {
						currentNode = parent;
						break;
					}
					parent = parent.parentNode;
				}
				if (currentNode !== parent) {
					return false;
				}
				break;
			}
		}
		currentSelectorIndex--;
	}
	return true;
};

export const matchSelectorGroups = (selectorGroups: ISelector[][], node: INode, finder?: IParentNode) => selectorGroups.some(selectors => matchSelectors(selectors, node, finder));
