import { ITagNode, ITextNode, NodeType } from '../../src';
import { parse } from '../../src/parse';

test('xml声明必须在最前面', async () => {
	try {
		await parse(' <?xml version="1.1" ?><svg/>');
	} catch (err) {
		expect(err.message).toMatch(/^The xml declaration must be at the front of the document!/);
	}
});

test('文档结构错误', async () => {
	try {
		await parse('<svg>');
	} catch (err) {
		expect(err.message).toMatch(/^Document structure is wrong!/);
	}
});

test('开始和结束标签无法匹配', async () => {
	try {
		await parse('<svg></html>');
	} catch (err) {
		expect(err.message).toMatch(/^The start and end tags cannot match!/);
	}
});

test('开始和结束标签无法匹配2', async () => {
	try {
		await parse('</svg>');
	} catch (err) {
		expect(err.message).toMatch(/^The start and end tags cannot match!/);
	}
});

test('只允许出现一个根元素节点', async () => {
	try {
		await parse('<svg/><svg/>');
	} catch (err) {
		expect(err.message).toMatch(/^Only one root element node is allowed!/);
	}
});

test('没有根元素节点', async () => {
	try {
		await parse('');
	} catch (err) {
		expect(err.message).toMatch(/^No root element node!/);
	}
});

test('属性名重复', async () => {
	try {
		await parse('<svg attr="1" attr="2"/>');
	} catch (err) {
		expect(err.message).toMatch(/^Duplicate property names!/);
	}
});

test('意外的结束标签', async () => {
	try {
		await parse('<svg/></svg>');
	} catch (err) {
		expect(err.message).toMatch(/^Unexpected end tag!/);
	}
});

test('意外的文本节点', async () => {
	try {
		await parse('<svg/>123');
	} catch (err) {
		expect(err.message).toMatch(/^Unexpected text node!/);
	}
});

test('意外的文本节点2', async () => {
	try {
		await parse('  a <svg/>');
	} catch (err) {
		expect(err.message).toMatch(/^Unexpected text node!/);
	}
});

test('错误的开始标签', async () => {
	try {
		await parse('<svg:/>');
	} catch (err) {
		expect(err.message).toMatch(/^Wrong start tag!/);
	}
});

test('错误的结束标签', async () => {
	try {
		await parse('<svg></:svg>');
	} catch (err) {
		expect(err.message).toMatch(/^Wrong end tag!/);
	}
});

test('错误的属性名', async () => {
	try {
		await parse('<svg attr:="1"/>');
	} catch (err) {
		expect(err.message).toMatch(/^Wrong attribute name!/);
	}
});

test('错误的属性名2', async () => {
	try {
		await parse(`<svg
		:attr=""/>`);
	} catch (err) {
		expect(err.message).toMatch(/^Wrong attribute name!/);
	}
});

test('解析标签失败', async () => {
	try {
		await parse('< svg />');
	} catch (err) {
		expect(err.message).toMatch(/^Failed to parse nodes!/);
	}
});

test('CDATA 出现在根下', async () => {
	try {
		await parse('<![CDATA[123]]>123<svg></svg>');
	} catch (err) {
		expect(err.message).toMatch(/^Invalid CDATA element!/);
	}
});

test('CDATA 出现在根下2', async () => {
	try {
		await parse('<svg></svg><![CDATA[123]]>123');
	} catch (err) {
		expect(err.message).toMatch(/^Invalid CDATA element!/);
	}
});

test('namespace', async () => {
	const dom = await parse('<xml:svg></xml:svg>');
	expect(dom.childNodes.length).toBe(1);
	expect(dom.childNodes[0].namespace).toBe('xml');
});

test('textContent', async () => {
	const dom = await parse('  <svg><![CDATA[123]]></svg>  ');
	expect(((dom.childNodes[0] as ITagNode).childNodes[0] as ITextNode).textContent).toBe('123');
	expect(((dom.childNodes[0] as ITagNode).childNodes[0] as ITextNode).nodeType).toBe(NodeType.CDATA);
});
