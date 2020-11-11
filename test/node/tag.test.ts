import { TagNode } from '../../src/node/tag';
import { NodeType } from '../../src';

test('标签', () => {
	const svg = new TagNode({
		nodeName: 'svg',
		nodeType: NodeType.Tag,
	});
	svg.setAttribute('href', 'test', 'xlink');
	expect(svg.hasAttribute('href')).toBeFalsy();
	expect(svg.hasAttribute('xlink:href')).toBeTruthy();
	expect(svg.hasAttribute('href', 'xlink')).toBeTruthy();
	expect(svg.hasAttribute('href', 'xml')).toBeFalsy();

	expect(svg.getAttribute('xlink', 'href')).toBeNull;
	expect(svg.getAttribute('href', 'xlink')).toBe('test');
	svg.setAttribute('xlink:href', 'aaa');
	expect(svg.getAttribute('xlink:href')).toBe('aaa');
	svg.setAttribute('href', 'bbb', 'xlink');
	expect(svg.getAttribute('href', 'xlink')).toBe('bbb');

	expect(svg.removeAttribute('href')).toBeFalsy();
	expect(svg.removeAttribute('xlink:href')).toBeTruthy();
});
