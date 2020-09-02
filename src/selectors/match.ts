import { INode, ITag } from '../../typings/node';
import { ISelector } from '../../typings/style';
import { NodeType } from '../node/node-type';
import { attrModifier, selectorUnitCombinator, validPseudoClass, validPseudoElement } from './define';
import { parseSelector } from './parse';

// 验证 className
const checkClass = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	const classAttr = (node as ITag).getAttribute('class');
	let classNames: string[] = [];
	if (classAttr) {
		classNames = classAttr.trim().split(/\s+/);
	}
	return selector.class.every(className => classNames.includes(className));
};

// 验证 ID
const checkID = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	let id = (node as ITag).getAttribute('id');
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
		let attr = (node as ITag).getAttribute(attrSelector.key);
		if (attr === null) {
			return false;
		} else if (attrSelector.value) {
			// 属性值大小写不敏感
			attr = attr.trim().toLowerCase();
			switch (attrSelector.modifier) {
				// 开始字符匹配
				case attrModifier['^']:
					if (attr.indexOf(attrSelector.value) !== 0) {
						return false;
					}
					break;
				// 结尾字符匹配
				case attrModifier['$']:
					if (attr.lastIndexOf(attrSelector.value) !== attr.length - attrSelector.value.length) {
						return false;
					}
					break;
				// 空格分组字符匹配
				case attrModifier['~']:
					if (!attr.split(/\s+/).includes(attrSelector.value)) {
						return false;
					}
					break;
				// 前缀字符匹配
				case attrModifier['|']:
					if (attr !== attrSelector.value && attr.indexOf(`${attrSelector.value}-`) !== 0) {
						return false;
					}
					break;
				// 模糊匹配
				case attrModifier['*']:
					if (!attr.includes(attrSelector.value)) {
						return false;
					}
					break;
				// 默认全字匹配
				default:
					if (attr !== attrSelector.value) {
						return false;
					}
					break;
			}
		}
	}
	return true;
};

// 验证伪类和伪元素
// 根据 SVG 标准只验证 CSS 2.1 规范的伪类和伪元素
// https://www.w3.org/TR/SVG2/styling.html#RequiredCSSFeatures
const checkPseudo = (node: INode, selector: ISelector): boolean => {
	if (node.nodeType !== NodeType.Tag) return false;
	for (let pi = selector.pseudo.length; pi--;) {
		const pseudoSelector = selector.pseudo[pi];
		if (!validPseudoClass.includes(pseudoSelector.func) && !validPseudoElement.includes(pseudoSelector.func)) {
			return false;
		}

		// 命中伪元素，需要验证作用域链上是否存在文本节点 text
		if (validPseudoElement.includes(pseudoSelector.func)) {
			let hasText = false;
			if (node.nodeName === 'text') {
				hasText = true;
			} else {
				if ((node as ITag).querySelector('text')) {
					hasText = true;
				}
			}
			if (!hasText) {
				return false;
			}
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

export const matchBySelectors = (selectorGroups: string[], node: INode) => selectorGroups.some(selectorGroup => {
	const selectors = parseSelector(selectorGroup);
	const len = selectors.length;
	if (!matchSelector(selectors[len - 1], node)) return false;
	let currentNode: INode = node;
	let i = len - 2;
	while (i >= 0) {
		switch (selectors[i].combinator) {
			// 子选择器
			case selectorUnitCombinator['>']:
				if (currentNode.parentNode) {
					if (!matchSelector(selectors[i], currentNode.parentNode)) {
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
					const index = brothers.indexOf(currentNode);
					if (index <= 0 || !matchSelector(selectors[i], brothers[index - 1])) {
						return false;
					}
					currentNode = brothers[index - 1];
					break;
				}
				return false;
				// 兄弟选择器
			case selectorUnitCombinator['~']:
				if (currentNode.parentNode) {
					const _brothers = currentNode.parentNode.childNodes;
					const _index = _brothers.indexOf(currentNode);
					if (_index <= 0) {
						return false;
					}
					let _brother: INode | undefined;
					for (let bi = _index; bi--;) {
						_brother = _brothers[bi];
						if (matchSelector(selectors[i], _brother)) {
							currentNode = _brother;
							return false;
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
					if (matchSelector(selectors[i], parent)) {
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
		i--;
	}
	return true;
});
