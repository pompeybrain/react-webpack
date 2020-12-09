# 代码规范

## 知识前提

JSDOC & TSDOC
https://jsdoc.app/index.html
https://typedoc.org/guides/doccomments/

## model 定义

业务对象，或者代码库的一些数据模型定义，需要加上一些说明注释
注释的格式有一定要求，以便编辑器提供代码提示
比如下面的 service/response.ts 中的 ServerResponse 的定义：

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

## 命名规范

文件夹使用小写加连字符如： account user-device

包括页面组件和共用组件
组件的命名因为大写字母开头如：Account

组件的样式文件使用小写加连字符格式如：org-tree.less
