import { IDynamicObj } from '../../typings';
import { IDocument, INode, IParentNode, ITag, IText } from '../../typings/node';
import { ParentNode, TextNode } from '../node';
import { NodeType } from '../node/node-type';
import { collapseQuots } from '../utils/collapse-quots';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { REG_ATTR, REG_CDATA_SECT, REG_COMMENTS, REG_DOCTYPE, REG_END_TAG, REG_START_TAG, REG_XML_DECL } from './regs';

interface IStatus {
	line: number;
	pos: number;
	lastpos: number;
}

interface IEndTag {
	nodeType: -1;
	nodeName: string;
	namespace: string;
}

interface ICurrent<T extends IParentNode | IText | IEndTag = IParentNode | IText | IEndTag> {
	node: T;
	selfClose?: boolean;
	lastIndex: number;
}

const configs: Array<[string, RegExp, number]> = [
	['xml-decl', REG_XML_DECL, NodeType.XMLDecl],
	['cdata', REG_CDATA_SECT, NodeType.CDATA],
	['doctype', REG_DOCTYPE, NodeType.DocType],
	['comments', REG_COMMENTS, NodeType.Comments],
];

const updStatus = (pos: number, str: string, status: IStatus) => {
	for (; status.lastpos < pos; status.lastpos++) {
		if (str[status.lastpos] === '\r' || str[status.lastpos] === '\n') {
			// 换行判断，\r 直接换行，\n 判断一下是不是紧跟在 \r 后面
			if (str[status.lastpos] === '\r' || str[status.lastpos - 1] !== '\r') {
				status.line++;
				status.pos = 0;
			}
		} else {
			status.pos++;
		}
	}
};

const ProcessTagLess = ([name, reg, type]: typeof configs[0], str: string, lastIndex: number): ICurrent<IText> | null => {
	reg.lastIndex = lastIndex;
	const execResult = reg.exec(str);
	if (execResult && execResult.index === lastIndex) {
		return {
			node: new TextNode({
				nodeType: type,
				nodeName: `#${name}`,
				textContent: execResult[0],
			}),
			lastIndex: reg.lastIndex,
		} as ICurrent<IText>;
	}
	return null;
};

// 处理标签
const ProcessTag = (str: string, status: IStatus, lastIndex: number): ICurrent<IParentNode> | null => {
	REG_START_TAG.lastIndex = lastIndex;
	const execResult = REG_START_TAG.exec(str);
	if (execResult && execResult.index === lastIndex) {
		const tempStatus: IStatus = { line: status.line, pos: status.pos, lastpos: 0 };
		const result = {
			node: new ParentNode({
				nodeType: NodeType.Tag,
				nodeName: execResult[1],
				namespace: '',
			}),
			selfClose: execResult[3] === '/',
			lastIndex: REG_START_TAG.lastIndex,
		} as ICurrent<IParentNode>;

		// 标签的 namespace
		if (execResult[1].includes(':')) {
			const tagName = execResult[1].split(':');
			if (tagName.length !== 2 || !tagName[0] || !tagName[1]) {
				throw new Error(`Wrong start tag! At ${status.line}:${status.pos}`);
			} else {
				result.node.nodeName = tagName[1];
				result.node.namespace = tagName[0];
			}
		}

		updStatus(execResult[1].length + 1, execResult[0], tempStatus);

		// ** 重要 ** 重置匹配位置！
		REG_ATTR.lastIndex = 0;

		let attrExec = REG_ATTR.exec(execResult[2]);
		const attrUnique: IDynamicObj<boolean> = {};
		while (attrExec) {
			updStatus(attrExec.index + execResult[1].length + 1, execResult[0], tempStatus);

			// 属性名排重
			if (attrUnique[attrExec[1]]) {
				throw new Error(`Duplicate property names! At ${tempStatus.line}:${tempStatus.pos}`);
			}
			attrUnique[attrExec[1]] = true;

			if (attrExec[1].includes(':')) {
				const attrName = attrExec[1].split(':');
				if (attrName.length === 2 && attrName[0] && attrName[1]) {
					result.node.setAttribute(attrName[1], collapseQuots(attrExec[2]).trim(), attrName[0]);
				} else {
					throw new Error(`Wrong attribute name! At ${tempStatus.line + status.line - 1}:${tempStatus.line > 1 ? tempStatus.pos : status.pos + tempStatus.pos}`);
				}
			} else {
				result.node.setAttribute(attrExec[1], collapseQuots(attrExec[2]).trim());
			}
			attrExec = REG_ATTR.exec(execResult[2]);
		}

		return result;
	}
	return null;
};


const ProcessEndTag = (str: string, status: IStatus, lastIndex: number): ICurrent<IEndTag> | null => {
	REG_END_TAG.lastIndex = lastIndex;
	const execResult = REG_END_TAG.exec(str);
	if (execResult && execResult.index === lastIndex) {
		const result: ICurrent<IEndTag> = {
			node: {
				nodeType: -1,
				nodeName: execResult[1],
				namespace: '',
			},
			lastIndex: REG_END_TAG.lastIndex,
		};
		if (execResult[1].includes(':')) {
			const tagName = execResult[1].split(':');
			if (tagName.length !== 2 || !tagName[1] || !tagName[0]) {
				throw new Error(`Wrong end tag! At ${status.line}:${status.pos}`);
			} else {
				result.node.nodeName = tagName[1];
				result.node.namespace = tagName[0];
			}
		}
		return result;
	}
	return null;
};


const parseNode = (str: string, status: IStatus, lastIndex: number): ICurrent => {
	const REG_LT = /</g;
	REG_LT.lastIndex = lastIndex;
	const ltExec = REG_LT.exec(str);
	if (ltExec) {
		if (ltExec.index === lastIndex) { // 以 < 开始的情况都按节点处理

			for (const cfg of configs) {
				const processTagLess = ProcessTagLess(cfg, str, lastIndex);
				if (processTagLess) {
					return processTagLess;
				}
			}

			const processTag = ProcessTag(str, status, lastIndex);
			if (processTag) {
				return processTag;
			}

			const processEndTag = ProcessEndTag(str, status, lastIndex);
			if (processEndTag) {
				return processEndTag;
			}
			throw new Error(`Failed to parse nodes! At ${status.line}:${status.pos}`);

		} else { // 非 < 开始的都按文本处理

			return {
				node: new TextNode({
					nodeType: NodeType.Text,
					nodeName: '#text',
					textContent: mixWhiteSpace(str.slice(lastIndex, ltExec.index)),
				}),
				lastIndex: ltExec.index,
			} as ICurrent<IText>;

		}
	} else {

		return {
			node: new TextNode({
				nodeType: NodeType.Text,
				nodeName: '#text',
				textContent: mixWhiteSpace(str.slice(lastIndex)),
			}),
			lastIndex: str.length,
		} as ICurrent<IText>;

	}
};

export const parse = async (str: string): Promise<IDocument> => {
	return new Promise((resolve, reject) => {
		const doc = new ParentNode({
			nodeType: NodeType.Document,
			nodeName: '#document',
		}) as IDocument;
		const stack: Array<IDocument | ITag> = [];
		const status: IStatus = {
			line: 1,
			pos: 0,
			lastpos: 0,
		};
		const len = str.length;

		let current: ICurrent;
		let hasRoot = false;
		const firstIndex = str.indexOf('<');
		if (firstIndex > 0 && !/^\s+</.test(str)) {
			reject(new Error(`Unexpected text node! At ${status.line}:${status.pos}`));
			return;
		}
		try {
			current = parseNode(str, status, firstIndex); // 第一个 < 之前的全部字符都忽略掉
		} catch (e) {
			reject(e);
			return;
		}
		if (current.node.nodeType === NodeType.XMLDecl && firstIndex > 0) {
			reject(new Error(`The xml declaration must be at the front of the document! At ${status.line}:${status.pos}`));
			return;
		}
		if (current.node.nodeType === -1) {
			reject(new Error(`The start and end tags cannot match! At ${status.line}:${status.pos}`));
		}
		doc.appendChild(current.node as INode);
		if (current.node.nodeType === NodeType.Tag) {
			hasRoot = true;
			if (!current.selfClose) {
				stack.push(current.node as ITag);
			}
		}

		while (current.lastIndex < len) {

			updStatus(current.lastIndex, str, status);
			try {
				current = parseNode(str, status, current.lastIndex); // 第一个 < 之前的全部字符都忽略掉
			} catch (e) {
				reject(e);
				return;
			}

			const stackLen = stack.length;

			if (current.node.nodeType === -1) {

				// 遇到结束标签的处理逻辑
				if (stackLen) {
					// 结束标签和开始标签匹配
					if (stack[stackLen - 1].nodeName === current.node.nodeName && stack[stackLen - 1].namespace === current.node.namespace) {
						stack.pop();
					} else {
						reject(new Error(`The start and end tags cannot match! At ${status.line}:${status.pos}`));
						return;
					}
				} else {
					// 没有开始标签而出现了结束标签
					reject(new Error(`Unexpected end tag! At ${status.line}:${status.pos}`));
					return;
				}


			} else {

				if (stackLen) {
					// 插入子节点
					stack[stackLen - 1].appendChild(current.node as INode);
				} else if ((current.node as IText).textContent) {
					// 没有节点而出现了非空文本节点
					if ((current.node as IText).textContent.trim()) {
						reject(new Error(`Unexpected text node! At ${status.line}:${status.pos}`));
						return;
					}
				} else {
					// 直接扔到根下
					doc.appendChild(current.node as INode);
				}
				// 遇到未闭合的节点，扔到stack内
				if ((current.node as INode).nodeType === NodeType.Tag) {
					if (!stackLen) {
						if (hasRoot) {
							reject(new Error(`Only one root element node is allowed! At ${status.line}:${status.pos}`));
							return;
						}
						hasRoot = true;
					}
					if (!current.selfClose) {
						stack.push(current.node as ITag);
					}
				}
			}

			if (current.lastIndex === len) {
				updStatus(len, str, status);
			}

		}

		if (stack.length) {
			reject(new Error(`Document structure is wrong! At ${status.line}:${status.pos}`));
			return;
		}

		if (!hasRoot) {
			reject(new Error(`No root element node! At ${status.line}:${status.pos}`));
			return;
		}

		resolve(doc);
	});
};
