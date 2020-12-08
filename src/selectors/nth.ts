import { ITagNode } from '../../typings/node';

// 解析 an+b of S
export const parseNTH = (type: string): [number, number, string] => {
	const [anb, ofS] = type.split(/\s+of\s+/).map(s => s.trim());
	let a = 0;
	let b = 0;
	if (anb === 'even') {
		a = 2;
	} else if (anb === 'odd') {
		a = 2;
		b = 1;
	} else {
		const nth = /^([+-]?\d*)n(?:\s*([+-])\s*(\d+))?$/i.exec(anb);
		if (nth) {
			if (/^[+-]?$/.test(nth[1])) { // 没有数字，则补1
				a = +`${nth[1]}1`;
			} else {
				a = +nth[1];
			}
			if (nth[2] && nth[3]) {
				b = (nth[2] === '+' ? 1 : -1) * (+nth[3]);
			}
		} else if (/^[+-]?\d+$/.test(anb)) {
			b = +anb;
		}
	}
	return [a, b, ofS ?? ''];
};

// 判断 an+b 格式的命中情况
export const checkNTH = (node: ITagNode, list: ITagNode[], a: number, b: number) => {
	const index = list.indexOf(node) + 1;
	// 当前元素被筛掉
	if (index === 0) return false;
	if (a <= 0) {
		if (b <= 0) {
			return false;
		} else {
			if (a === 0) {
				return b === index;
			} else {
				return index <= b && b % -a === index % -a;
			}
		}
	} else {
		b = b % a;
		if (b < 0) {
			b += a;
		}
		return index % a === b;
	}
};
