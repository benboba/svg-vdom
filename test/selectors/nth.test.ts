import { ITagNode, matchSelector, parse, parseSelector } from '../../src';

test('match pseudo', async () => {
	const dom = await parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg>
		<rect id="r1"/>
		<rect id="r2"/>
		<rect id="r3"/>
		<rect id="r4"/>
		<rect id="r5"/>
		<rect id="r6"/>
		<rect id="r7"/>
	</svg>`);

	const svg = dom.childNodes[1] as ITagNode;
	const noParent = svg.children[6];
	svg.removeChild(noParent);

	let pseudoSelector = parseSelector(':nth-child(2n+1)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-child(+2n of rect)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-child(3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-child(-2n--3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-child(-n)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-child(4n-3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-child(odd)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-child(even)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeTruthy();

    pseudoSelector = parseSelector(':nth-last-child(+2n+1)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-last-child(2n of rect)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-last-child(3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-last-child(-2n--3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-last-child(-n)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':nth-last-child(4n-3)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-last-child(odd)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeTruthy();

	pseudoSelector = parseSelector(':nth-last-child(even)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeTruthy();
});

test('match of type', async () => {
	const dom = await parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg>
		<rect id="r1"/>
		<circle id="r2"/>
		<rect id="r3"/>
		<circle id="r4"/>
		<circle id="r5"/>
		<rect id="r6"/>
		<rect id="r7"/>
	</svg>`);

	const svg = dom.childNodes[1] as ITagNode;
	const noParent = svg.children[6];
	svg.removeChild(noParent);

	let pseudoSelector = parseSelector(':nth-of-type(2n+1)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
    expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();

    pseudoSelector = parseSelector(':nth-of-type(-n+1 of rect)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
    expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();

    pseudoSelector = parseSelector(':nth-last-of-type(2n)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeTruthy();
    expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();

    pseudoSelector = parseSelector(':nth-last-of-type(1 of circle)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeFalsy();
});
