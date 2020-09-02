import { ParentNode, TextNode } from '../../src/node';
import { NodeType } from '../../src/node/node-type';

test('节点', function() {
	const dom = new ParentNode({
		nodeName: '#document',
		nodeType: NodeType.Document,
	});

	const xml = new TextNode({
		nodeName: '#xml-decl',
		nodeType: NodeType.XMLDecl,
		textContent: '',
	});
	const xmlClone = xml.cloneNode();
	expect(xmlClone.textContent).toBe('');

	dom.appendChild(xml);

	const svg = new ParentNode({
		nodeName: 'svg',
		nodeType: NodeType.Tag,
	});

	const text = new ParentNode({
		nodeName: '#text',
		nodeType: NodeType.Tag,
	});

	dom.appendChild(svg.cloneNode());
	svg.setAttribute('width', '200');
	svg.setAttribute('height', '100');
	dom.appendChild(svg);
	dom.appendChild(svg.cloneNode());
	dom.appendChild(svg);
	expect(dom.childNodes.length).toBe(4);
	expect(dom.childNodes[3]).toBe(svg);
	svg.remove();
	svg.remove();
	expect(dom.childNodes.length).toBe(3);

	expect(text.matches(NodeType.Tag)).toBeTruthy;
	expect(text.matches(node => node.nodeName === '#text')).toBeTruthy;

	const g = new ParentNode({
		nodeName: 'g',
		nodeType: NodeType.Tag,
	});

	svg.appendChild(g);
	dom.appendChild(svg);
	expect(g.matches('svg > g')).toBeTruthy;
});
