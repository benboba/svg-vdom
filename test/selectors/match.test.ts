import { IParentNode, ITagNode, matchSelector, matchSelectorGroups, matchSelectors, NodeType, parse, parseSelector } from '../../src';

test('match selectors', async () => {
	const dom = await parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<title>Group Copy 31</title>
		<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g id="Mobile基础-图标备份" transform="translate(-399.000000, -817.000000)">
				<g id="Group-Copy-31" transform="translate(420.000000, 838.000000) rotate(-90.000000) translate(-420.000000, -838.000000) translate(399.000000, 817.000000)">
					<rect id="Rectangle-7" x="0" y="0" width="42" height="42"></rect>
					<path d="M11.9480882,3.93066303 C12.5017555,3.38601786 13.3710706,3.35883433 13.9562642,3.8441856 L14.069337,3.94808819 L30.069337,20.2131319 C30.6076658,20.7603782 30.6413113,21.617558 30.1702736,22.203546 L30.069337,22.3169555 L14.5907864,38.0519118 C14.0098316,38.6424903 13.0601162,38.6502918 12.4695377,38.069337 C11.9158703,37.5246918 11.8744093,36.6559407 12.3500815,36.0628526 L12.4521125,35.9480882 L26.896,21.265 L11.930663,6.05191181 C11.3860179,5.49824446 11.3588343,4.62892943 11.8441856,4.04373577 L11.9480882,3.93066303 Z" id="Path-2" fill="#555555" fill-rule="nonzero"></path>
				</g>
			</g>
		</g>
	</svg>`);

	const svg = dom.childNodes[1] as IParentNode;
	svg.remove();

	expect(matchSelectorGroups([], svg)).toBeFalsy();
	expect(matchSelectors([], svg)).toBeFalsy();

	for (let i = svg.childNodes.length; i--;) {
		const child = svg.childNodes[i];
		if (child.nodeType === NodeType.Text) {
			child.remove();
		}
	}

	expect(matchSelectors(parseSelector('g > title')[0], svg.querySelector('title') as ITagNode)).toBeFalsy();
	expect(matchSelectors(parseSelector('g > svg')[0], svg)).toBeFalsy();

	expect(matchSelectors(parseSelector('xml + svg')[0], svg)).toBeFalsy();
	expect(matchSelectors(parseSelector('svg + g')[0], svg.querySelector('#Page-1') as ITagNode)).toBeFalsy();

	expect(matchSelectors(parseSelector('xml ~ svg')[0], svg)).toBeFalsy();
	expect(matchSelectors(parseSelector('g ~ title')[0], svg.querySelector('title') as ITagNode)).toBeFalsy();
	expect(matchSelectors(parseSelector('svg ~ g')[0], svg.querySelector('#Page-1') as ITagNode)).toBeFalsy();

	expect(matchSelectors(parseSelector('xml svg')[0], svg)).toBeFalsy();
	expect(matchSelectors(parseSelector('g  title')[0], svg.querySelector('title') as ITagNode)).toBeFalsy();
});

test('match selector', async () => {
	const dom = await parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<title>Group Copy 31</title>
		<g class="Page-1 page" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<text>123</text>
		</g><g class="Page-1 page" stroke="#000" stroke-width="1" fill="none" fill-rule="evenodd"/><g class="Pager-1 page" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"/><g class="Page-1 page" stroke="none" stroke-width="1" fill="#000" fill-rule="evenodd"/><g class="Page-1 page" stroke="none" stroke-width="1" fill="non" fill-rule="evenodd"/><g class="Page-1 page" stroke="none" stroke-width="1" fill="one" fill-rule="evenodd"/><g class="Page-1 pge" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"/>
	</svg>`);

	const svg = dom.childNodes[1] as IParentNode;
	const classSelector = parseSelector('.Page-1.page')[0][0];
	expect(matchSelector(classSelector, svg.childNodes[3])).toBeTruthy();
	expect(matchSelector(classSelector, svg.childNodes[0])).toBeFalsy();
	expect(matchSelector(classSelector, svg.childNodes[1])).toBeFalsy();

	const pseudoSelector1 = parseSelector(':hover')[0][0];
	const pseudoSelector2 = parseSelector('::first-letter')[0][0];
	const pseudoSelector3 = parseSelector('::undef')[0][0];
	expect(matchSelector(pseudoSelector1, svg.childNodes[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector1, svg.childNodes[3])).toBeTruthy();
	expect(matchSelector(pseudoSelector2, svg.childNodes[3])).toBeTruthy();
	expect(matchSelector(pseudoSelector3, svg.childNodes[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector1, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector2, svg.childNodes[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector3, svg.childNodes[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector2, svg.querySelector('text') as ITagNode)).toBeTruthy();

	const attrSelector = parseSelector('[stroke=none][class|=Page][fill^=n][fill$=e][fill*=on][class~=page][fill-rule]')[0][0];
	expect(matchSelector(attrSelector, svg.childNodes[0])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[1])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[3])).toBeTruthy();
	expect(matchSelector(attrSelector, svg.childNodes[4])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[5])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[6])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[7])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[8])).toBeFalsy();
	expect(matchSelector(attrSelector, svg.childNodes[9])).toBeFalsy();

	let pseudoSelector = parseSelector(':lang')[0][0];
	expect(matchSelector(pseudoSelector, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.childNodes[3])).toBeTruthy();
	pseudoSelector = parseSelector(':link')[0][0];
	expect(matchSelector(pseudoSelector, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.childNodes[3])).toBeTruthy();
	pseudoSelector = parseSelector(':visited')[0][0];
	expect(matchSelector(pseudoSelector, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.childNodes[3])).toBeTruthy();
	pseudoSelector = parseSelector(':active')[0][0];
	expect(matchSelector(pseudoSelector, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.childNodes[3])).toBeTruthy();
	pseudoSelector = parseSelector(':focus')[0][0];
	expect(matchSelector(pseudoSelector, svg.childNodes[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.childNodes[3])).toBeTruthy();
});

test('match pseudo', async () => {
	const dom = await parse(`<?xml version="1.0" encoding="UTF-8"?>
	<svg>
		<rect id="r1"/>
		<circle name="r2"/>
		<rect/>
		<rect/>
		<rect/>
		<circle id="r6"/>
		<rect id="r7"/>
	</svg>`);

	const svg = dom.childNodes[1] as ITagNode;
	const noParent = svg.children[6];
	svg.removeChild(noParent);

	let pseudoSelector = parseSelector(':empty')[0][0];
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();

	let pse = parseSelector(':root')[0];
	expect(matchSelectors(pse, svg)).toBeTruthy();
	expect(matchSelectors(pse, noParent)).toBeTruthy();
	expect(matchSelectors(pse, svg.children[0])).toBeFalsy();
	expect(matchSelectors(pse, svg.children[5])).toBeFalsy();

	pse = parseSelector(':root rect')[0];
	expect(matchSelectors(pse, svg)).toBeFalsy();
	expect(matchSelectors(pse, noParent)).toBeTruthy();
	expect(matchSelectors(pse, svg.children[0])).toBeTruthy();
	expect(matchSelectors(pse, svg.children[5])).toBeFalsy();

	pseudoSelector = parseSelector(':first-child')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':last-child')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeTruthy();

	pseudoSelector = parseSelector(':only-child')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeFalsy();

	pseudoSelector = parseSelector(':first-of-type')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeFalsy();

	pseudoSelector = parseSelector(':last-of-type')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[3])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[4])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeTruthy();

	pseudoSelector = parseSelector(':only-of-type')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[5])).toBeFalsy();

	pseudoSelector = parseSelector(':target')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeFalsy();

	pseudoSelector = parseSelector(':not(rect)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeTruthy();

	pseudoSelector = parseSelector(':not(:nth-of-type(1))')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeTruthy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[2])).toBeTruthy();

	pseudoSelector = parseSelector(':not()')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();

	pseudoSelector = parseSelector(':not(1)')[0][0];
	expect(matchSelector(pseudoSelector, noParent)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg)).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[0])).toBeFalsy();
	expect(matchSelector(pseudoSelector, svg.children[1])).toBeFalsy();
});
