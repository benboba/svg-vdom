import { IDocumentFragment, INode, IParentNode, ITagNode, ITextNode, IDocument } from '../../typings/node';
import { NodeType } from '../node/node-type';
import { mixWhiteSpace } from '../utils/mix-white-space';

export const stringifyNode = (node: INode): string => {
	let xml = '';
	const textContent = (node as ITextNode).textContent || '';
	switch (node.nodeType) {
		case NodeType.Tag:
			xml += stringifyTag(node as ITagNode);
			break;
		case NodeType.Text:
			xml += mixWhiteSpace(textContent);
			break;
		case NodeType.XMLDecl:
			xml += `<?xml${mixWhiteSpace(` ${textContent}`).replace(/\s(?="|=|$)/g, '')}?>`;
			break;
		case NodeType.Comments: {
			const comments = mixWhiteSpace(textContent).trim();
			if (comments) {
				xml += `<!--${comments}-->`;
			}
			break;
		}
		case NodeType.CDATA:
			if (!textContent.includes('<')) {
				xml += mixWhiteSpace(textContent);
			} else {
				xml += `<![CDATA[${mixWhiteSpace(textContent)}]]>`;
			}
			break;
		case NodeType.DocType:
			xml += `<!DOCTYPE${mixWhiteSpace(` ${textContent.trim()}`)}>`;
			break;
		default:
			// document | documentFragment
			xml += stringifySVG(node as IDocument | IDocumentFragment);
			break;
	}
	return xml;
};

export const stringifyTag = (node: ITagNode): string => {
	let xml = '';
	xml += `<${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}`;
	if (node.attributes.length) {
		for (const { name, value, namespace } of node.attributes) {
			const val = value.trim();
			if (val) {
				xml += ` ${namespace ? `${namespace}:` : ''}${name}="${mixWhiteSpace(val).replace(/"/g, '&quot;')}"`;
			}
		}
	}

	if (node.childNodes.length) {
		xml += '>';
		xml += stringifySVG(node);
		xml += `</${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}>`;
	} else {
		xml += '/>';
	}
	return xml;
};

export const stringifySVG = (dom?: IParentNode | null): string => {
	if (!dom) return '';
	return dom.childNodes.reduce((result, node) => `${result}${stringifyNode(node)}`, '');
};
