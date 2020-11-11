import { attrModifier, parseSelector, selectorUnitCombinator } from '../../src';

test('simple parse', () => {
	const parseResult = parseSelector('svg > g');
	expect(parseResult.length).toBe(1);
	expect(parseResult[0].length).toBe(2);
	expect(parseResult[0][0].type).toBe('svg');
	expect(parseResult[0][0].combinator).toBe(selectorUnitCombinator['>']);
	expect(parseResult[0][1].type).toBe('g');

	const parseResult1 = parseSelector('*.a ~ #test.b.c.d[e^="test"] + [f] [f=g]:not(h) [f|=g]:hover [f$=g][f~=g][f*=g]::first-child');
	expect(parseResult1.length).toBe(1);
	expect(parseResult1[0].length).toBe(6);
	expect(parseResult1[0][0].universal).toBeTruthy();
	expect(parseResult1[0][0].class[0]).toBe('a');
	expect(parseResult1[0][0].combinator).toBe(selectorUnitCombinator['~']);
	expect(parseResult1[0][1].id[0]).toBe('test');
	expect(parseResult1[0][1].class.length).toBe(3);
	expect(parseResult1[0][1].attr[0].modifier).toBe(attrModifier['^']);
	expect(parseResult1[0][1].combinator).toBe(selectorUnitCombinator['+']);
	expect(parseResult1[0][3].pseudo[0]).toEqual({ func: 'not', value: 'h', isClass: true });
	expect(parseResult1[0][5].attr.length).toBe(3);
	expect(parseResult1[0][5].pseudo[0]).toEqual({ func: 'first-child', isClass: false });
});

test('group parse', () => {
	const parseResult = parseSelector('svg > g, #Path-1, g > g rect ~ circle');
	expect(parseResult.length).toBe(3);
});

test('bad case', () => {
	const parseResult = parseSelector('svg > g, #Path-1, g > g rect ~ circle$');
	expect(parseResult.length).toBe(0);
});
