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

### 13.2.1 用户代理历史

HTTP 规范(1.0和1.1)要求浏览器应该向服务器发送包含浏览器名称和版本信息的简短字符串

这个规范进一步要求用户代理字符串应该是“标记/版本”形式的产品列表

#### 1.早期浏览器

- 1993 年 Mosaic：`Mosaic/0.9`

- Netscape Navigator 2：`Mozilla/Version [language] (platform; Encryption)`

  - Language: 语言代码

  - Platform: 浏览器所在的操作系统平台

  - Encryption: 安全加密类型

    `Mozilla/2.02 [fr] (WinNT; I)`

#### 2.Netscape Navigator 3 和 IE3

- 1996 Netscape Navigator 3：`Mozilla/Version [language] (platform; Encryption[; OS-or-CPU description])`

  `Mozilla/3.0 (Win95; U)`

- IE3：`Mozilla/2.0 (compatible; MSIE Version; Operating System)`

  `Mozilla/2.0 (compatible; MSIE 3.02; Windows 95)`

  IE 将自己伪造成 Mozilla，结果引发了争议，违反了浏览器标识初衷

#### 3.Netscape Communicator 4 和 IE4~8

- 1997 年 8 月，Netscape Communicator 4：`Mozilla/Version (platform; Encryption [; Os-or-CPU description])`
- IE4：`Mozilla/4.0 (compatible; MSIE Version; Operating System)`
  - IE4 ~ IE7 Mozilla 版本号没变过，只有 Version 变
- IE8：`Mozilla/4.0 (compatible; MSIE Version; Operating System; Trident/TridentVersion)`
  - "Trident" 是浏览器引擎的代号，为了让开发者知道什么时候 IE8 运行兼容模式
- IE9：`Mozilla/5.0 (compatible; MSIE Version; Operating System; Trident/TridentVersion)`

#### 4.Gecko

Gecko 渲染引擎是 Firefox 的核心

- Netscape6：`Mozilla/MozillaVersion (platform; Encryption; Os-or-CPU; Language; PrereleaseVersion)Gecko/GeckoVersion ApplicationProduct/ApplicationProductionVersion`

#### 5.Webkit

2003 年苹果发布 Safari，Safari 的渲染引擎叫 Webkit，是基于 Linux 平台浏览器 Konqueror 使用的渲染引擎 KHTML 开发的

- Safari：`Mozilla/5.0 (Platform; Encryption; Os-or-CPU; Language) AppleWebkit/AppleWebkitVersion (KHTML, like Gecko) Safari/SafariVersion`

#### 6.Konqueror

Linux 桌面环境打包发布的浏览器，基于开源引擎 `KHTML`

- Konqueror 3.2：`Mozilla/5.0 (compatible; Konqueror/KonquerorVersion; Os-or-CPU) KHTML/KHTMLVersion(KHTML, like Gecko)`

#### 7.Chrome

Blink 作为渲染引擎，V8 作为 JavaScript 引擎，包好了所有 Webkit 信息，加上 Chrome 及版本信息

`Mozilla/5.0 (Platform; Encryption; Os-or-CPU; Language) AppleWebkit/AppleWebkitVersion (KHTML, like Gecko) Chrome/ChromeVersion Safari/SafariVersion`

#### 8.Opera

- Opera 8 之前：`Opera/Version (Os-or-CPU; Encryption) [Language]`
- Opera 8：`Opera/Version (Os-or-CPU; Encryption; Language)`
- Opera 9：
  - `Mozilla/5.0 (Windows NT 5.1; U; en; rv: 1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.50`
  - `Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.50`
- Opera 10：`Opera/9.80 (OS-or-CPU; Encryption; Language) Presto/PrestoVersion Version/Version`
  - Presto 是 Opera 的渲染引擎
- Opera52：`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebkit/537.36 (KHTML, Like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.64`

#### 9.iOS 与 Android

默认的浏览器都是基于 Webkit

- iOS：`Mozilla/5.0 (Platform; Encryption; Os-or-CPU Like Mac OS X; Language) AppleWebkit/AppleWebkitVersion (KHTML, like Gecko) Version/BrowserVersion Mobile/MobileVersion Safari/SafariVersion`
- Android(没有 `Mobile` 后面的版本号)：`Mozilla/5.0 (Platform; Encryption; Os-or-CPU Like Mac OS X; Language) AppleWebkit/AppleWebkitVersion (KHTML, like Gecko) Version/BrowserVersion Mobile Safari/SafariVersion`

### 13.2.2 浏览器分析

`window.navigator.userAgent`

#### 1.伪造用户代理

```js
window.navigator.__defineGetter__('userAgent', () => 'foobar');

console.log(window.navigator.userAgent);
// foobar
```

#### 2.分析浏览器

- 浏览器
- 浏览器版本
- 浏览器渲染引擎
- 设备类型（桌面/移动）
- 设备生产商
- 设备型号
- 操作系统
- 操作系统版本

第三方用户代理解析程序

- [Bowser](https://github.com/lancedikson/bowser)
- [UAParser.js](https://github.com/faisalman/ua-parser-js)
- [Platform.js](https://github.com/bestiejs/platform.js)
- [CURRENT-DEVICE](https://github.com/matthewhudson/current-device)
- [Google Closure](https://github.com/google/closure-library)
- [Mootools](https://github.com/mootools/mootools-core)

## 13.3 软件与硬件检测

暴露在 `window.navigator` 上

### 13.3.1 识别浏览器与操作系统

#### 1.navigator.oscpu

检测操作系统/系统架构信息

#### 2.navigator.vendor

浏览器开发商信息

#### 3.navigator.platform

浏览器所在的操作系统

#### 4.screen.colorDepth 和 screen.pixelDepth

显示器每像素颜色的位深

#### 5.screen.orientation

返回 `ScreenOrientation` API，表示屏幕方向信息

### 13.3.2 浏览器元数据

#### 1.Geolocation API

`navigator.geolocation` 暴露了 Geolocation API，让浏览器脚本感知当前设备位置信息，返回一个 `Geolocation `

#### 2.Connection State 和 NetworkInformation API

- 表示网络连接状态：`navigator.onLine`
- 连接状态：`navigator.connection`

#### 3.Battery Status API

表示设备电池及充电状态 `navigator.getBattery()`

### 13.3.3 硬件

#### 1.处理器核心数

`navigator.hardwareConcurrency` 返回浏览器支持的逻辑处理器核心数量

#### 2.设备内存大小

`navigator.deviceMemory`

#### 3.最大触点数

`navigator.maxTouchPoints`

