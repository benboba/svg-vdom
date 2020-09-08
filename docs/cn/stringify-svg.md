# stringifySVG(dom?: IParentNode | null)

将容器节点作为 virtual dom 字符串化

## 参数

名称 | 类型 | 说明 | 必须 | 默认值
---- | ---- | ---- | ---- | ----
dom | [IParentNode](types.md#iparentnode)/null | 要进行字符串化的容器节点 | × | --

## 返回值

字符串化后的结果

## 备注

- 如果 dom 参数为 null 或不传，会返回空字符串
- 只会将 dom 的子节点字符串化，dom 节点自身会被忽略
