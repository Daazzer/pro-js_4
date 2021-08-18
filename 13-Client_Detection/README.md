# 第 13 章 客户端检测

## 13.1 能力检测

只需检测自己关心的能力是否存在即可

IE5前：`document.all` 替代 `document.getElementById()`

两个重要概念

- 先检测最常用的方式
- 必须检测切实需要的特性

### 13.1.1 安全能力检测

尽量使用 `typeof` 操作符

```js
// 检测 sort 是不是函数
function isSortable(object) {
    return typeof object.sort == "function";
}
```

### 13.1.2 基于能力检测

#### 1.检测特性

如果你的程序需要使用特定的浏览器能力，最好集中检测

```js
// 检测是否具有 DOM Level 1 能力
let hasDOM1 = !!(document.getElementById && document.createElement && document.getElementByTagName);
```

#### 2.检测浏览器

用于确认用户使用的什么浏览器

`navigator.userAgent` 属性

#### 3.能力检测的局限

检测一种或一组能力，并不总能确定使用的是哪种浏览器

## 13.2 用户代码检测

通过用户代理字符串确定使用的是什么浏览器。通过 `navigator.userAgent` 访问

在客户端，用户代理检测被认为是不可靠的，只应该在没有其他选项时再考虑



