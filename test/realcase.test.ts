import { parse, ITagNode, selectorUnitCombinator } from '../src';

test('real case', async () => {
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
	expect(dom.childNodes.length).toBe(2);
	expect(dom.querySelector('a')).toBeNull();
	expect((dom.querySelector('title') as ITagNode).nodeName).toBe('title');
	const g = dom.querySelectorAll('g') as ITagNode[];
	expect(g.length).toBe(3);
	expect(g[2].getAttribute('id')).toBe('Group-Copy-31');
	const brothers = dom.querySelectorAll('title ~ #Page-1, g g rect + path');
	expect(brothers.length).toBe(2);
	const brother = dom.querySelector('title ~ #Page-1, g g rect + path');
	expect(brother).toBe(dom.querySelector('#Page-1'));
	expect(brother).toBe(dom.querySelector([{
		type: 'title',
		id: [],
		class: [],
		attr: [],
		pseudo: [],
		combinator: selectorUnitCombinator['+'],
	}, {
		id: ['Page-1'],
		class: [],
		attr: [],
		pseudo: [],
	}]));
	expect(brother).toBe(dom.querySelectorAll({
		id: ['Page-1'],
		class: [],
		attr: [],
		pseudo: [],
	})[0]);
	expect(dom.querySelectorAll('rect, #Rectangle-7').length).toBe(1);
});
