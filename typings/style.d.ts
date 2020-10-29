// 属性选择器接口定义
export interface IAttrSelector {
	key: string;
	modifier?: 1 | 2 | 3 | 4 | 5;
	value?: string;
}

// 伪类选择器接口定义
export interface IPseudo {
	func: string;
	isClass: boolean;
	value?: string;
}

// 选择器接口定义
export interface ISelector {
	universal?: boolean;
	type?: string;
	id: string[];
	class: string[];
	attr: IAttrSelector[];
	pseudo: IPseudo[];
	combinator?: 1 | 2 | 3 | 4;
}
