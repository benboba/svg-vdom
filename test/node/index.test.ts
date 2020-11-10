import { NodeType } from '../../src/node/node-type';
import { ParentNode } from '../../src/node/parent';
import { TagNode } from '../../src/node/tag';
import { TextNode } from '../../src/node/text';

test('节点', () => {
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

	const svg = new TagNode({
		nodeName: 'svg',
		nodeType: NodeType.Tag,
	});

	const text = new TagNode({
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
	dom.removeChild([svg, svg, svg]);
	svg.remove();
	expect(dom.childNodes.length).toBe(3);

	expect(text.matches(NodeType.Tag)).toBeTruthy();
	expect(text.matches(node => node.nodeName === '#text')).toBeTruthy();

	const g = new ParentNode({
		nodeName: 'g',
		nodeType: NodeType.Tag,
	});

	svg.appendChild(g);
	dom.appendChild(svg);
	expect(g.matches('svg > g')).toBeTruthy();
	expect(g.closest('g')).toBe(g);
	expect(g.closest(NodeType.Document)).toBe(dom);
	expect(g.closest(NodeType.DocumentFragment)).toBeNull;
});
