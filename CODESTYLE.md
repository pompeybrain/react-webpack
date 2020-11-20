# 代码规范

## 知识前提

JSDOC & TSDOC
https://jsdoc.app/index.html
https://typedoc.org/guides/doccomments/

## model 定义

业务对象，或者代码库的一些数据模型定义，需要加上一些说明注释
注释的格式有一定要求，以便编辑器提供代码提示
比如下面的 request.ts 中的 ServerResponse 的定义：

```ts
/**
 * 后端接口返回的数据模型
 */
interface ServerResponse {
  /**
   * 错误码
   */
  code: number;
  /**
   * 返回的数据
   */
  data: any;
  /**
   * 报错信息
   */
  message: string;
  /**
   * 是否成功
   */
  success: boolean;
}
```
