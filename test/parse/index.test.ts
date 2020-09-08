import { parse } from '../../src/parse';

test('xml声明必须在最前面', () => {
	parse(' <?xml version="1.1" ?><svg/>').catch(err => {
		expect(err.message).toMatch(/^The xml declaration must be at the front of the document!/);
	});
});

test('文档结构错误', () => {
	parse('<svg>').catch(err => {
		expect(err.message).toMatch(/^Document structure is wrong!/);
	});
});

test('开始和结束标签无法匹配', () => {
	parse('<svg></html>').catch(err => {
		expect(err.message).toMatch(/^The start and end tags cannot match!/);
	});
});

test('开始和结束标签无法匹配', () => {
	parse('</svg>').catch(err => {
		expect(err.message).toMatch(/^The start and end tags cannot match!/);
	});
});

test('只允许出现一个根元素节点', () => {
	parse('<svg/><svg/>').catch(err => {
		expect(err.message).toMatch(/^Only one root element node is allowed!/);
	});
});

test('没有根元素节点', () => {
	parse('').catch(err => {
		expect(err.message).toMatch(/^No root element node!/);
	});
});

test('属性名重复', () => {
	parse('<svg attr="1" attr="2"/>').catch(err => {
		expect(err.message).toMatch(/^Duplicate property names!/);
	});
});

test('意外的结束标签', () => {
	parse('<svg/></svg>').catch(err => {
		expect(err.message).toMatch(/^Unexpected end tag!/);
	});
});

test('意外的文本节点', () => {
	parse('<svg/>123').catch(err => {
		expect(err.message).toMatch(/^Unexpected text node!/);
	});
});

test('意外的文本节点2', () => {
	parse('  a <svg/>').catch(err => {
		expect(err.message).toMatch(/^Unexpected text node!/);
	});
});

test('错误的开始标签', () => {
	parse('<svg:/>').catch(err => {
		expect(err.message).toMatch(/^Wrong start tag!/);
	});
});

test('错误的结束标签', () => {
	parse('<svg></:svg>').catch(err => {
		expect(err.message).toMatch(/^Wrong end tag!/);
	});
});

test('错误的属性名', () => {
	parse('<svg attr:="1"/>').catch(err => {
		expect(err.message).toMatch(/^Wrong attribute name!/);
	});
});

test('错误的属性名2', () => {
	parse(`<svg
	:attr=""/>`).catch(err => {
		expect(err.message).toMatch(/^Wrong attribute name!/);
	});
});

test('解析标签失败', () => {
	parse('< svg />').catch(err => {
		expect(err.message).toMatch(/^Failed to parse nodes!/);
	});
});

test('namespace', async () => {
	const dom = await parse('<xml:svg></xml:svg>');
	expect(dom.childNodes.length).toBe(1);
	expect(dom.childNodes[0].namespace).toBe('xml');
});
