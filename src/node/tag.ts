import { IAttr, IParentNodeOption, ITagNode } from '../../typings/node';
import { NodeType } from './node-type';
import { ParentNode } from './parent';

export class TagNode extends ParentNode implements ITagNode {
	constructor(option: IParentNodeOption) {
		super(option);
		this.attributes = [];
	}

	nodeType: ITagNode['nodeType'] = NodeType.Tag;
	attributes: ITagNode['attributes'];

	/**
	 * 复制自身，但是不复制节点树关系链
	 */
	cloneNode() {
		const cloneNode = new TagNode({
			nodeName: this.nodeName,
			nodeType: this.nodeType,
			namespace: this.namespace,
		});
		// 属性需要深拷贝
		cloneNode.attributes = this.attributes.map(attr => ({ ...attr }));
		return cloneNode;
	}

	/**
	 * 是否存在属性
	 * @param _name 属性名
	 * @param _namespace 属性命名空间
	 */
	hasAttribute(_name: string, _namespace?: string): boolean {
		for (const { fullname, name, namespace } of this.attributes) {
			if (!namespace) {
				if (fullname === _name) {
					return true;
				}
			} else {
				if (name === _name && namespace === _namespace) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 获取属性
	 * @param _name 属性名
	 * @param _namespace 属性命名空间
	 */
	getAttribute(_name: string, _namespace?: string): string | null {
		for (const { name, value, fullname, namespace } of this.attributes) {
			if (!_namespace) {
				if (fullname === _name) {
					return value;
				}
			} else {
				if (name === _name && namespace === _namespace) {
					return value;
				}
			}
		}
		return null;
	}

	/**
	 * 设置属性
	 * @param name 属性名
	 * @param value 属性值
	 * @param namespace 属性命名空间
	 */
	setAttribute(name: string, value: string, namespace?: string): void {
		for (const attr of this.attributes) {
			if (!namespace) {
				if (attr.fullname === name) {
					attr.value = value;
					return;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					attr.value = value;
					return;
				}
			}
		}

		const newAttr: IAttr = {
			name,
			value,
			fullname: name,
		};
		if (namespace) {
			newAttr.fullname = `${namespace}:${name}`;
			newAttr.namespace = namespace;
		}
		this.attributes.push(newAttr);
	}

	/**
	 * 移除属性
	 * @param name 属性名
	 * @param namespace 属性命名空间
	 */
	removeAttribute(name: string, namespace?: string): boolean {
		for (let i = this.attributes.length; i--;) {
			const attr = this.attributes[i];
			if (!namespace) {
				if (attr.fullname === name) {
					this.attributes.splice(i, 1);
					return true;
				}
			} else {
				if (attr.name === name && attr.namespace === namespace) {
					this.attributes.splice(i, 1);
					return true;
				}
			}
		}
		return false;
	}
}
