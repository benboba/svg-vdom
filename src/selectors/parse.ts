import { ISelector } from '../../typings/style';
import { attrChar, attrModifier, classChar, idChar, pseudoChar, selectorUnitCombinator } from './define';

const tagChar = '(?:[a-zA-Z]+|\\*)';
const selectorChar = `(?:${idChar}|${classChar}|${attrChar}|${pseudoChar})`;
const combinatorChar = '(?:\\s*[>+~]\\s*|\\s+)';
const selectorUnitReg = new RegExp(`^(${tagChar}?)(${selectorChar}*)(${combinatorChar}|$)`);
const selectorGroupReg = new RegExp(`^(\\s*>\\s*)?((?:${tagChar}${selectorChar}*|${tagChar}?${selectorChar}+)(?:${combinatorChar}(?:${tagChar}${selectorChar}*|${tagChar}?${selectorChar}+))*)\\s*(?:,|$)`);

const parseSelectorUnit = (selector: string): ISelector[] => {
	const selectors: ISelector[] = [];
	let selectorStr = selector.trim();
	let selectorExec = selectorUnitReg.exec(selectorStr);
	while (selectorExec && selectorExec[0].length) {
		const selectorUnit: ISelector = { id: [], class: [], attr: [], pseudo: [] };
		if (selectorExec[1]) {
			if (selectorExec[1] === '*') {
				selectorUnit.universal = true;
			} else {
				selectorUnit.type = selectorExec[1];
			}
		}
		if (selectorExec[2]) {
			let specialStr = selectorExec[2];
			const specialReg = new RegExp(`^${selectorChar}`);
			let specialExec = specialReg.exec(specialStr);
			while (specialExec) {
				switch (specialExec[0][0]) {
					case '.': // class 选择器
						selectorUnit.class.push(specialExec[0].slice(1));
						break;
					case '[': { // 属性选择器
						const attrStr: string = specialExec[0].slice(1, -1);
						const eqIndex: number = attrStr.indexOf('=');
						if (eqIndex === -1) {
							// 没有等号的情况
							selectorUnit.attr.push({
								key: attrStr,
							});
						} else {
							// 取出等号修饰符
							if (typeof attrModifier[attrStr[eqIndex - 1] as keyof typeof attrModifier] === 'number') {
								selectorUnit.attr.push({
									key: attrStr.slice(0, eqIndex - 1),
									modifier: attrModifier[attrStr[eqIndex - 1] as keyof typeof attrModifier],
									value: attrStr.slice(eqIndex + 1),
								});
							} else {
								selectorUnit.attr.push({
									key: attrStr.slice(0, eqIndex),
									value: attrStr.slice(eqIndex + 1),
								});
							}
						}
						break;
					}
					case ':': { // 伪类，伪元素
						const isClass = specialExec[0][1] !== ':';
						const pseudoStr = specialExec[0].replace(/^:+/, '');
						const parenIndex: number = pseudoStr.indexOf('(');
						if (parenIndex === -1) {
							// 不是函数型伪类
							selectorUnit.pseudo.push({
								func: pseudoStr,
								isClass,
							});
						} else {
							selectorUnit.pseudo.push({
								func: pseudoStr.slice(0, parenIndex),
								value: pseudoStr.slice(parenIndex + 1, -1),
								isClass,
							});
						}
						break;
					}
					default: // id 选择器
						selectorUnit.id.push(specialExec[0].slice(1));
						break;
				}
				specialStr = specialStr.slice(specialExec[0].length);
				specialExec = specialReg.exec(specialStr);
			}
		}
		if (selectorExec[3]) {
			const combinator = selectorExec[3].trim() as keyof typeof selectorUnitCombinator;
			if (typeof selectorUnitCombinator[combinator] === 'number') {
				selectorUnit.combinator = selectorUnitCombinator[combinator];
			}
		}
		selectors.push(selectorUnit);
		selectorStr = selectorStr.slice(selectorExec[0].length).trim();
		selectorExec = selectorUnitReg.exec(selectorStr);
	}
	return selectors;
};

export const parseSelector = (query: string) => {
	const groups: ISelector[][] = [];
	let queryStr = query.trim();
	let queryExec = selectorGroupReg.exec(queryStr);

	while (queryExec) {
		const selectors = parseSelectorUnit(queryExec[2]);
		// 选择器允许以 > 开始
		if (queryExec[1]) {
			selectors.unshift({
				combinator: selectorUnitCombinator['&>'],
				id: [],
				class: [],
				attr: [],
				pseudo: [],
			});
		}
		groups.push(selectors);
		queryStr = queryStr.slice(queryExec[0].length).trim();
		if (!queryStr) {
			return groups;
		}
		queryExec = selectorGroupReg.exec(queryStr);
	}
	return [];
};
