import { NodeType, ParentNode, TagNode, TextNode } from '../../src';

test('fragment', () => {
	const fragment = new ParentNode({
		nodeType: NodeType.DocumentFragment,
		nodeName: '#document-fragment',
	});

	const tag = new TagNode({
		nodeType: NodeType.Tag,
		nodeName: 'svg',
		namespace: 'xml',
	});
	tag.setAttribute('href', 'test', 'xlink');
	tag.setAttribute('empty', '');
	const text = new TextNode({
		nodeType: NodeType.Text,
		nodeName: '#text',
		textContent: 'soso',
	});
	tag.appendChild(text);

	fragment.appendChild(tag);
	fragment.appendChild(tag.cloneNode());

	expect(fragment.toString()).toBe('<xml:svg xlink:href="test">soso</xml:svg><xml:svg xlink:href="test"/>');
	
	expect(fragment.childNodes.length).toBe(2);
	expect(tag.appendChild(fragment)).toBeFalsy();
	expect(fragment.childNodes.length).toBe(2);

	const svg = tag.cloneNode();
	tag.nodeName = 'tag';

	expect(tag.childNodes.includes(text)).toBeTruthy();
	expect(svg.appendChild(text)).toBeTruthy();
	expect(tag.childNodes.includes(text)).toBeFalsy();
	expect(svg.replaceChild(tag, fragment)).toBeNull();
	expect(fragment.childNodes.length).toBe(1);
	expect(svg.replaceChild(fragment, tag)).toBe(tag);
	expect(fragment.childNodes.length).toBe(0);

	const frag = fragment.cloneNode();
	expect(frag.appendChild(tag)).toBeTruthy();
	expect(svg.appendChild(svg)).toBeFalsy();
	expect(frag.childNodes.length).toBe(1);
	expect(svg.appendChild(frag)).toBeTruthy();
	expect(frag.childNodes.length).toBe(0);

	frag.appendChild(text);
	expect(frag.childNodes[0]).toBe(text);
	frag.insertBefore(tag, text);
	expect(frag.childNodes[0]).toBe(tag);
	expect(frag.childNodes[1]).toBe(text);

	fragment.appendChild(svg);
	fragment.insertBefore(frag, svg);
	expect(frag.childNodes.length).toBe(0);
	expect(fragment.childNodes[0].nodeName).toBe('tag');
	expect(fragment.childNodes[1].nodeName).toBe('#text');
	expect(fragment.childNodes[2].nodeName).toBe('svg');

	expect(fragment.insertBefore([fragment], frag)).toBeFalsy();
	expect(fragment.replaceChild([fragment], frag)).toBeNull();

	const _svg = svg.cloneNode();
	_svg.nodeName = '_svg';
	_svg.appendChild(svg);
	expect(_svg.replaceChild(tag, svg)).toBe(svg);
	expect(_svg.childNodes[0]).toBe(tag);
	fragment.appendChild(svg);
	expect(_svg.replaceChild([fragment], tag)).toBe(tag);
	expect(_svg.childNodes.length).toBe(2);
	expect(_svg.replaceChild([tag], svg)).toBe(svg);
	expect(svg.parentNode).toBeUndefined();
	expect(_svg.replaceChild([tag], tag)).toBeNull();
	expect(tag.parentNode).toBe(_svg);
	expect(_svg.replaceChild(tag, tag)).toBeNull();
	expect(tag.parentNode).toBe(_svg);
	expect(_svg.replaceChild([svg], svg)).toBeNull();
	expect(svg.parentNode).toBe(_svg);
	expect(_svg.childNodes.length).toBe(3);

	fragment.appendChild(svg);
	expect(_svg.childNodes.length).toBe(2);
	expect(_svg.replaceChild(fragment, svg)).toBeNull();
	svg.remove();
	expect(_svg.childNodes.includes(svg)).toBeFalsy();
	expect(_svg.replaceChild(svg, svg)).toBeNull();
	expect(_svg.replaceChild([svg], svg)).toBeNull();
	expect(_svg.childNodes.includes(svg)).toBeTruthy();
	expect(svg.replaceChild([_svg], svg)).toBeNull();
	expect(svg.replaceChild(_svg, _svg)).toBeNull();
	expect(_svg.childNodes.length).toBe(3);
	fragment.appendChild([svg, tag]);
	expect(_svg.replaceChild([svg, tag, text], text)).toBeNull();
	expect(_svg.replaceChild([svg, tag, text], text)).toBeNull();

	fragment.appendChild([svg, tag, text]);
	expect(_svg.childNodes.length).toBe(0);
	expect(_svg.insertBefore(fragment, frag)).toBeTruthy();
	expect(_svg.childNodes.length).toBe(3);
	expect(_svg.insertBefore(svg, svg)).toBeTruthy();
	fragment.appendChild([svg, tag]);
	expect(_svg.insertBefore([svg, tag], svg)).toBeTruthy();
	expect(svg.remove()).toBeTruthy();
	expect(_svg.childNodes.length).toBe(2);
	expect(_svg.insertBefore(svg, svg)).toBeTruthy();
	expect(_svg.childNodes.length).toBe(3);

	expect(svg.remove()).toBeTruthy();
	svg.childNodes.length = 0;
	svg.appendChild(_svg);
	expect(svg.childNodes.length).toBe(1);
	expect(_svg.childNodes.length).toBe(2);
	svg.replaceChild(_svg.childNodes, _svg);
	expect(svg.childNodes.length).toBe(2);
	expect(_svg.appendChild(svg.childNodes)).toBeTruthy();
	expect(svg.childNodes.length).toBe(0);
	expect(_svg.childNodes.length).toBe(2);
	expect(_svg.removeChild(_svg.childNodes)).toBeTruthy();
	expect(_svg.childNodes.length).toBe(0);
});
