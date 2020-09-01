export interface IDynamicObj<T> {
	[attr: string]: T;
}

export type TBaseObj = Record<never, unknown>;
