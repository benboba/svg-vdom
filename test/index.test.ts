import { NodeType, stringifyNode, stringifySVG, stringifyTag } from '../src';
import { ParentNode } from '../src/node/parent';
import { TagNode } from '../src/node/tag';
import { TextNode } from '../src/node/text';
import { IDocument } from '../typings/node';

test('stringify', () => {
	const dom = new ParentNode({
		nodeName: '#document',
		nodeType: NodeType.Document,
	}) as IDocument;

	expect(NodeType[dom.nodeType]).toBe('Document');

	const xml = new TextNode({
		nodeName: '#xml-decl',
		nodeType: NodeType.XMLDecl,
		textContent: '',
	});

	const doctype = new TextNode({
		nodeType: NodeType.DocType,
		nodeName: '#doctype',
		textContent: '   x   ml   ',
	});

	dom.appendChild([xml, doctype]);

	const svg = new TagNode({
		nodeName: 'svg',
		nodeType: NodeType.Tag,
	});
	dom.appendChild(svg.cloneNode());
	svg.setAttribute('width', '100');
	svg.setAttribute('href', '1', 'xlink');
	expect(svg.hasAttribute('xlink:href')).toBeTruthy();
	expect(svg.hasAttribute('xml:href')).toBeFalsy();
	expect(svg.hasAttribute('width')).toBeTruthy();
	expect(svg.hasAttribute('height')).toBeFalsy();
	svg.setAttribute('height', '100');
	expect(svg.hasAttribute('height')).toBeTruthy();
	svg.setAttribute('width', '200');
	expect(svg.getAttribute('width')).toBe('200');
	svg.removeAttribute('href', 'xlink');
	expect(svg.attributes.length).toBe(2);
	dom.appendChild([svg, svg.cloneNode()]);

	expect(stringifySVG(dom)).toBe('<?xml?><!DOCTYPE x ml><svg/><svg width="200" height="100"/><svg width="200" height="100"/>');
	expect(stringifyTag(svg)).toBe('<svg width="200" height="100"/>');
	expect(stringifyNode(xml)).toBe('<?xml?>');

	const text = new TextNode({
		nodeType: NodeType.Text,
		nodeName: '#text',
		textContent: 'cde',
	});
	svg.appendChild(text);
	svg.appendChild(text.cloneNode());
	text.textContent = 'ab';
	const cdata = new TextNode({
		nodeType: NodeType.CDATA,
		nodeName: '#cdata',
		textContent: '<ev  il>',
	});
	svg.appendChild([cdata, cdata.cloneNode(), cdata.cloneNode()]);
	cdata.textContent = 'angel';
	const comment = new TextNode({
		nodeType: NodeType.Comments,
		nodeName: '#comment',
		textContent: '   <just   so   so>   ',
	});
	svg.appendChild([comment, comment.cloneNode()]);
	comment.textContent = '';
	expect(stringifyTag(svg)).toBe('<svg width="200" height="100">abcdeangel<![CDATA[<ev il>]]><![CDATA[<ev il>]]><!--<just so so>--></svg>');

	expect(dom.children[0].nodeName).toBe('svg');
	expect(svg.children.length).toBe(0);

	expect(stringifySVG()).toBe('');
});
