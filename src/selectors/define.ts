// 选择器混合字符，不含后代选择器（空格）
export enum selectorUnitCombinator {
	'>' = 1,
	'+',
	'~',
	'&>', // 特殊，表示最顶层元素必须是当前查找者的子元素
}

// 属性选择器等号修饰符
export enum attrModifier {
	'^' = 1,
	'$',
	'~',
	'|',
	'*',
}

// 用于验证的正则表达式

// css 选择器相关字符
export const idChar = '#[^#\\.\\[\\*:\\s,]+';
export const classChar = '\\.[^#\\.\\[\\*:\\s,]+';
export const attrChar = '\\[[a-zA-Z][a-zA-Z0-9\\-]*(?:[\\|\\^\\$\\*~]?=(?:\'[^\']*\'|"[^"]*"|[^\'"\\]]+))?\\]';
export const pseudoChar = '\\:{1,2}[a-zA-Z-]+(?:\\((?:[^\\(\\)]*|[^\\(\\)]*\\([^\\(\\)]*\\))\\))?';

// export const validPseudoClass = ['hover', 'link', 'active', 'visited', 'focus', 'first-child', 'lang', 'not', 'root'];
// 伪元素暂时只支持这几个
export const validPseudoElement = ['first-letter', 'first-line', 'selection'];
