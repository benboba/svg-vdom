import { IDomNode, INode, ITagNode } from '../../typings/node';
import { NodeType } from '../node/node-type';
import { mixWhiteSpace } from '../utils/mix-white-space';

export const stringifyNode = (node: INode): string => {
	let xml = '';
	const textContent = node.textContent;
	switch (node.nodeType) {
		case NodeType.Tag:
			xml += stringifyTag(node as ITagNode);
			break;
		case NodeType.Text:
			xml += textContent;
			break;
		case NodeType.XMLDecl:
			xml += `<?xml${mixWhiteSpace(` ${textContent}`).replace(/\s(?="|=|$)/g, '')}?>`;
			break;
		case NodeType.Comments: {
			const comments = mixWhiteSpace(textContent as string).trim();
			if (comments) {
				xml += `<!--${comments}-->`;
			}
			break;
		}
		case NodeType.CDATA:
			if (!(textContent as string).includes('<')) {
				xml += textContent;
			} else {
				xml += `<![CDATA[${textContent}]]>`;
			}
			break;
		case NodeType.DocType:
			xml += `<!DOCTYPE${mixWhiteSpace(` ${(textContent as string).trim()}`)}>`;
			break;
		default:
			break;
	}
	return xml;
};

export const stringifyTag = (node: ITagNode): string => {
	let xml = '';
	xml += `<${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}`;
	if (node.attributes.length) {
		for (const { name, value, namespace } of node.attributes) {
			if (value.trim()) {
				xml += ` ${namespace ? `${namespace}:` : ''}${name}="${mixWhiteSpace(value.trim()).replace(/"/g, '&quot;')}"`;
			}
		}
	}

	if (node.childNodes.length) {
		xml += '>';
		node.childNodes.forEach(childNode => {
			xml += stringifyNode(childNode);
		});
		xml += `</${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}>`;
	} else {
		xml += '/>';
	}
	return xml;
};

export const stringifyXML = (dom?: IDomNode | null): string => {
	if (!dom) return '';
	return dom.childNodes.reduce((result, node) => `${result}${stringifyNode(node)}`, '');
};
