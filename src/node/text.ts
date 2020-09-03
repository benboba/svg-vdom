import { Node } from '.';
import { ITextNode } from '../../typings/node';

export interface ITextNodeOption {
	nodeName: ITextNode['nodeName'];
	nodeType: ITextNode['nodeType'];
	namespace?: ITextNode['namespace'];
	textContent: ITextNode['textContent'];
}

export class TextNode extends Node implements ITextNode {
	constructor(option: ITextNodeOption) {
		super(option);
		this.nodeType = option.nodeType;
		this.textContent = option.textContent;
	}

	textContent: ITextNode['textContent'];
	nodeType: ITextNode['nodeType'];

	cloneNode() {
		const cloneNode = new TextNode({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
			textContent: this.textContent,
		});
		return cloneNode;
	}
}
