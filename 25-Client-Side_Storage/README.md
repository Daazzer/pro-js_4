# 第 25 章 客户端存储

无论是登录信息、个人偏好，还是其他数据，Web 应用程序提供者都需要有办法把它们保存在客户端。

## 25.1 cookie

HTTP cookie 通常也叫作 cookie，最初用于在客户端存储会话信息。这个规范要求服务器在响应 HTTP 请求时，通过发送 `Set-Cookie` HTTP 头部包含会话信息。

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value
Other-header: other-header-value
```

这个 HTTP 响应会设置一个名为 `"name"`，值为 `"value"` 的 cookie。名和值在发送时都会经过 URL 编码。浏览器会存储这些会话信息，并在之后的每次请求中都会通过 HTTP 头部 cookie 再将它们发回服务器，比如：

```http
GET /index.jsl HTTP/1.1
Cookie: name=value
Other-header: other-header-value
```

这些发送会服务器的额外信息可用于唯一表示发送请求的客户端

### 25.1.1 限制

cookie 是与特定域绑定的。设置 cookie 后，它会与请求一起发送到创建它的域。这个限制能保证 cookie 中存储的信息只对被认可的接收者开放，不被其他域访问。

cookie 的限制

- 不超过 300 个 cookie
- 每个 cookie 不超过 4096 字节
- 每个域不超过 20 个 cookie
- 每个域不超过 81920 字节

### 25.1.2 cookie 构成

- **名称** 唯一标识 cookie 的名称。cookie 名不区分大小写，因此 `myCookie` 和 `MyCookie` 是同一个名称。不过，实践中最好将 cookie 名当成区分大小写来对待。cookie 名必须经过 URL 编码
- **值** 存储在 cookie 里的字符串值。这个值必须经过 URL 编码
- **域** cookie 有效的域。发送到这个域的所有请求都会包含对应的 cookie。这个值可能包含子域（如 www.wrox.com），也可以不包含（如 .wrox.com 表示对 wrox.com 的所有子域都有效）。如果不明确设置，则默认为设置 cookie 的域。
- **路径** 请求 URL 中包含这个路径才会把 cookie 发送到服务器。例如，可以指定 cookie 只能由 http://www.worx.com/books/ 访问，因此访问 http://www.wrox.com/ 下的页面就不会发送 cookie，即使请求的是同一个域
- **过期时间** 表示何时删除 cookie 的时间戳（即什么时间之后就不发送到服务器了）。默认情况下，浏览器会话结束后会删除所有 cookie。不过，也可以设置删除 cookie 时间。这个值是 GMT 格式（Wdy，DD-Mon-YYYY HH:MM:SS GMT），用指定删除 cookie 的具体时间。这样即使关闭浏览器 cookie 也会保留在用户机器上。把过期时间设置为过去的时间会立刻删除 cookie
- **安全标志** 设置之后，只在使用 SSL 安全连接的情况下才会把 cookie 发送到服务器。例如，请求 https://www.wrox.com 会发送 cookie，而请求 http://www.wrox.com 则不会

这些参数在 `Set-Cookie` 头部中使用分号加空格隔开

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; expires=Mon, 22-JAN-07 07:10:24 GMT; domain=.wrox.com;
Other-header: other-header-value
```

这个头部设置一个名为 `"name"` 的 cookie，这个 cookie 在 2007 年 1 月 22 日 7:10:24 过期，对 www.wrox.com 及其他 wrox.com 子域有效

安全标志 `secure` 是 cookie 中唯一的非名/值对，只需一个 `secure` 就可以了

```http
HTTP/1.1 200 OK
Content-type: text/html
Set-Cookie: name=value; domain=.wrox.com; path=/; secure
Other-header: other-header-value
```

这个 cookie 只能在 SSL 连接上发送，因为设置了 `secure` 标志

要知道，域、路径、过期时间和 `secure` 标志用于告诉浏览器什么情况下应该在请求中包含 cookie。这些参数并不会随请求发送给服务器，实际发送的只有 cookie 名/值对

### 25.1.3 JavaScript 中的 cookie

`document.cookie` 返回包含页面中所有有效 cookie 的字符串（根据域、路径、过期时间和安全设置），以逗号分隔，给 `document.cookie` 直接赋值不会覆盖原有的值，除非设置了相同的 cookie 名

`name1=value1;name2=value2;name3=value3`

所有名和值都是 URL 编码的，因此要用 `decodeURIComponent()` 编码

设置 cookie

```js
document.cookie = `${encodeURIComponent('name')}=${encodeURIComponent('Nicholas')}; domain=.wrox.com; path=/`;
```

### 25.1.4 子 cookie

为了绕过浏览器对每个域 cookie 数的限制，提出了子 cookie，子 cookie 是使用 cookie 的值在单个 cookie 中存储多个名/值对。

`name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5`

### 25.1.5 使用 cookie 的注意事项

还有一种叫作 **HTTP-only** 的 cookie。可以在浏览器设置，也可以在服务器设置。但只能在服务器上读取，这是因为 JavaScript 无法取得这种 cookie 的值

保存的 cookie 越大，请求时长越长。避免存储太大的 cookie

> **注意** 避免在 cookie 保存敏感信息

## 25.2 Web Storage

Web Storage 的第 2 版定义了两个对象：

- `localStorage` 是永久存储机制
- `sessionStorage` 是跨会话的存储机制

这两种浏览器存储 API 提供了在浏览器中不受页面刷新影响而存储数据的两种方式

### 25.2.1 Storage 类型

`Storage` 类型用于保存名/值对数据，直至存储空间上限（由浏览器决定）。

- `clear()` 删除所有值；不在 Firefox 实现
- `getItem(name)` 取得给定 `name` 的值
- `key(index)` 取得给定数值位置的名称
- `removeItem(name)` 删除给定 `name` 的名/值对
- `setItem(name, value)` 设置给定 `name` 的值

通过 `length` 属性可以确定 `Storage` 对象中保存了多少名/值对

> **注意** `Storage` 类型只能存储字符串。非字符串数据在存储之前会自动转换为字符串

### 25.2.2 sessionStorage 对象

`sessionStorage` 对象只存储会话数据，数据只会存储到浏览器关闭。并且不受页面刷新影响，可以在浏览器崩溃并重启后恢复。

可以使用 `getItem()` 或直接访问属性名来取得 `sessionStorage` 上的数据

```js
const name = sessionStorage.getItem('name');
const book = sessionStorage.book;
Object.entries(sessionStorage).forEach(([key, value]) => console.log(key, value));
```

从 `sessionStorage` 中删除数据，可以使用 `delete` 操作符或者 `removeItem()` 方法

```js
delete sessionStorage.name;
sessionStorage.removeItem('book');
```

### 25.2.3 localStorage 对象

`localStorage` 对象中的数据会保留到通过 JavaScript 删除或者用户清除浏览器缓存，并且不受页面刷新影响，也不会因关闭窗口、标签页或重启浏览器而丢失

可以使用 `getItem()` 或直接访问属性名来取得 `localStorage` 上的数据

```js
const name = localStorage.getItem('name');
const book = localStorage.book;
```

使用 `setItem()` 或直接设置属性来设置 `localStorage` 上的数据

```js
localStorage.setItem('name', 'Nicholas');
localStorage.book = 'Professional JavaScript';
```

从 `localStorage` 中删除数据，可以使用 `delete` 操作符或者 `removeItem()` 方法

```js
delete localStorage.name;
localStorage.removeItem('book');
```

### 25.2.4 存储事件

`Storage` 对象，使用属性或 `setItem()` 设置值、使用 `delete` 或 `removeItem()` 删除值，以及每次调用 `clear()` 时，都会在文档上触发 `storage` 事件。

事件对象属性：

- `domain` 存储变化对应的域
- `key` 被设置或删除的键
- `newValue` 键被设置的新值，若键被删除则为 `null`
- `oldValue` 键变化之前的值

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>存储事件</title>
</head>
<body>
  <button id="btn">点我设置值</button>

  <script>
    const btn = document.querySelector('#btn');
    // 要再打开新页面才会触发
    window.addEventListener('storage', event => {
      console.log(event.domain);
      console.log(event.key);
      console.log(event.newValue);
      console.log(event.oldValue);
    });
    btn.addEventListener('click', () => {
      let count = localStorage.getItem('count');
      count = Number(count || 0);
      localStorage.setItem('count', ++count);
    });
  </script>
</body>
</html>
```

监听的页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>存储事件1</title>
</head>
<body>
  <h2>用于监听存储事件的页面</h2>
  <script>
    window.addEventListener('storage', event => {
      console.log(event.domain);
      console.log(event.key);
      console.log(event.newValue);
      console.log(event.oldValue);
    });
  </script>
</body>
</html>
```

此技术可以用于跨页面通讯。

> **注意** 在同页面是不会触发 `storage` 事件的，必须要在相同的域不同的页面打开修改 `Storage` 时，才会在其它页面触发

### 25.2.5 限制

不同浏览器给 `localStorage` 和 `sessionStorage` 设置了不同的空间限制，但大多数会限制为每个源 5MB。

## 25.3 IndexedDB

Indexed Database API 简称 IndexedDB，方便 JavaScript 对象的存储和获取，同时也支持查询和搜索。

绝大多数 IndexedDB 操作要求加 `onerror` 和 `onsuccess` 事件处理程序来确定输出

### 25.3.1 数据库

IndexedDB 使用对象存储

使用 IndexedDB 数据库的第一步是调用 `indexedDB.open()`，传入一个要打开的数据库名称，如果给定名称的数据库已存在，则会发送一个打开它的请求；如果不存在，则会发送创建并打开这个数据库的请求。返回一个 `IDBRequest` 的实例，可以在这个实例上添加 `onerror` 和 `onsuccess` 事件处理器

```js
let db, request, version = 1;

request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => db = event.target.result;
```

`event.target` 都指向 `request` 请求

可以通过 `event.target.result` 访问数据库 `IDBDatabase` 实例

### 25.3.2 对象存储

如果数据库还不存在，`open()` 操作会创建一个新数据库，然后触发 `upgradeneeded` 事件；如果数据库存在，而你指定了一个升级的版本号，则会立即触发 `upgradeneeded` 事件。可以为这个事件设置处理程序，并在处理程序中创建数据库模式。

```js
request.onupgradeneeded = event => {
  const db = event.target.result;

  if (db.objectStoreNames.contains('users')) {
    db.deleteObjectStore('users');
  }

  // keyPath 属性表示应该用作键的存储对象的属性名
  db.createObjectStore('users', { keyPath: 'username' });
};
```

### 25.3.3 事务

创建了对象存储之后，剩下的所有操作都是通过**事务**完成的。通过数据库对象的 `transaction()` 方法创建

```js
const transaction = db.transaction('users');
```

访问多个对象存储

```js
const transaction = db.transaction(['users', 'anotherStore']);
```

修改访问模式，传入第二个参数。可选值 `"readonly"`、`"readwrite"`、`"versionchange"`

```js
const transaction = db.transaction('users', 'readwrite');
```

有了事务的引用，使用 `objectStore()` 方法并传入对象存储的名称以访问特定的对象存储

- `add()` 添加对象
- `put()` 更新对象
- `get()` 获得对象
- `delete()` 删除对象
- `clear()` 删除所有对象

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      request = store.get('007');
request.onerror = event => console.log('Did not get the object!');
request.onsuccess = event => console.log(event.target.result.firstName);
```

事务对象本身也有事件处理程序：`onerror` 和 `oncomplete`

### 25.3.4 插入对象

- `add()` 插入新值，如果存在同名的键会报错
- `put()` 更新值，重写该对象

```js
let request,
    requests = [];
users.forEach(user => {
  request = store.add(user);
  request.onerror = () => {
    // 处理错误
  };
  request.onsuccess = () => {
    // 处理成功
  };
  requests.push(request);
});
```

创建并填充了数据以后，就可以查询对象存储了

### 25.3.5 通过游标查询

如果想取得多条数据，则需要在事务中创建一个**游标**，游标是一个指向结果集的指针。与传统数据库查询不同，游标不会事先收集所有结果。相反，游标指向第一个结果，并在接到指令前不会主动查找下一条数据

在对象存储上创调用 `openCursor()` 方法创建游标。返回一个请求，有 `onsuccess` 和 `onerror` 事件

```js
const version = 1;
const request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => {
  const db = event.target.result,
        transaction = db.transaction('users'),
        store = transaction.objectStore('users'),
        request = store.openCursor();
  request.onerror = event => console.log('Did not get the object!');
  request.onsuccess = event => console.log(event.target);
};
```

`onsuccess` 事件处理程序，可以通过 `event.target.result` 访问对象存储中的下一条记录，保存着一个 `IDBCursor` 实例，有以下属性

- `direction` 字符串常量，表示游标的前进方向以及是否应该遍历所有重复的值。可能值：
  - `NEXT("next")`
  - `NEXTUNIQUE("nextunique")`
  - `PREV("prev")`
  - `PREVUNIQUE("prevunique")`
- `key` 对象的键
- `value` 实际的对象
- `primaryKey` 游标使用的键。可能是对象键或索引键

游标用于更新个别记录。`update()` 方法使用指定的对象更新当前游标对应的值。返回一个请求，有 `onsuccess` 和 `onerror` 事件

```js
const version = 1;
const request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => {
  const db = event.target.result,
        transaction = db.transaction('users'),
        store = transaction.objectStore('users'),
        request = store.openCursor();
  request.onerror = event => console.log('Did not get the object!');
  request.onsuccess = event => {
    const cursor = event.target.result;  // IDBCursor 实例，访问对象存储下一条记录
    console.log(event.target);
    if (cursor) {
      if (cursor.key === 'foo') {
        const value = cursor.value;
        value.password = 'magic';
        const updateRequest = cursor.update(value);
        updateRequest.onsuccess = () => {
          // TODO
        };
        updateRequest.onerror = () => {
          // TODO
        };
      }
    }
  };
};
```

也可以调用 `delete()` 来删除游标位置记录，返回一个请求

```js
const version = 1;
const request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => {
  const db = event.target.result,
        transaction = db.transaction('users'),
        store = transaction.objectStore('users'),
        request = store.openCursor();
  request.onerror = event => console.log('Did not get the object!');
  request.onsuccess = event => {
    const cursor = event.target.result;  // IDBCursor 实例，访问对象存储下一条记录
    console.log(event.target);
    if (cursor) {
      if (cursor.key === 'foo') {
        const deleteRequest = cursor.delete();  // 请求删除对象
        deleteRequest.onsuccess = () => {
          // TODO
        };
        deleteRequest.onerror = () => {
          // TODO
        };
      }
    }
  };
};
```

默认情况下，每个游标只会创建一个请求。要创建另外一个请求，必须调用

- `continue(key)` 移动结果集中的下一条记录。参数 `key` 是可选的。如果没有指定，游标就移动到下一条记录；如果指定了，则移动到指定的键
- `advance(count)` 游标向前移动指定的 `count` 条记录

两个方法都会重用 `onsuccess` 和 `onerror` 直至不需要

```js
const version = 1;
const request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => {
  const db = event.target.result,
        transaction = db.transaction('users'),
        store = transaction.objectStore('users'),
        request = store.openCursor();
  request.onerror = event => console.log('Did not get the object!');
  request.onsuccess = event => {
    const cursor = event.target.result;  // IDBCursor 实例，访问对象存储下一条记录
    if (cursor) {
      console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`);
      cursor.continue();
    } else {
      console.log('Done!');
    }
  };
};
```

在没有更多记录时，`onsuccess` 被最后一次调用，此时 `event.target.result` 等于 `null`

### 25.3.6 范围键

范围键对应 `IDBKeyRange` 的实例。

使用 `only()` 方法并传入想要获取的键

```js
const onlyRange = IDBKeyRange.only('007');
```

定义结果集的下限。下限表示游标开始的位置，如果想从 `"007"` 后面开始记录，可以再传入第二个参数 `true`

```js
const lowerRange = IDBKeyRange.lowerBound('007', true);
```

定义结果集的上限，如果不想包含指定键，可以在第二个参数传入 `true`

```js
const upperRange = IDBKeyRange.upperBound('ace', true);
```

同时指定下限和上限，可以使用 `bound()` 方法。接收 4 个参数：下限的键、上限的键、可选的布尔值表示是否跳过下限和可选布尔值表示是否跳过上限

```js
const boundRange = IDBKeyRange.bound('007', 'ace', false, true);
```

定义了范围之后，把它传给 `openCursor()` 方法，就可以得到位于该范围内的游标

```js
const version = 1;
const request = indexedDB.open('admin', version);
request.onerror = event => console.log(`Failed to open: ${event.target.errorCode}`);
request.onsuccess = event => {
  const db = event.target.result,
        transaction = db.transaction('users'),
        store = transaction.objectStore('users'),
        range = IDBKeyRange.bound('007', 'ace'),
        request = store.openCursor(range);
  request.onerror = event => console.log('Did not get the object!');
  request.onsuccess = event => {
    const cursor = event.target.result;  // IDBCursor 实例，访问对象存储下一条记录
    if (cursor) {
      console.log(`Key: ${cursor.key}, Value: ${JSON.stringify(cursor.value)}`);
      cursor.continue();
    } else {
      console.log('Done!');
    }
  };
};
```

### 25.3.7 设置游标方向

`openCursor()` 方法接受两个参数，第一个是 `IDEKeyRange` 的实例，第二个是表示方向的字符串。

- 从前往后的方向传 `"next"`、`"nextunique"`
- 从后往前的方向传 `"prev"`、`"prevunique"`

### 25.3.8 索引

创建索引，首先要取得对象存储的引用，然后调用 `createIndex()`，返回一个 `IDBIndex` 实例，在对象存储上调用 `index()` 方法也可以得到同一个实例

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.createIndex('username', 'username', { unique: true });
```

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.index('username');
```

可以 索引上使用 `openCursor()` 方法创建新游标，其 `result.key` 属性中保存的是索引键，而不是主键

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.index('username'),
      request = index.openCursor();
request.onsuccess = event => {
  // TODO...
};
```

使用 `openKeyCursor()` 也可以在索引上创建特殊游标，只返回每条记录主键。`event.target.result.key` 是索引键，`event.target.result.value` 是主键而不是整个记录

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.index('username'),
      request = index.openKeyCursor();
request.onsuccess = event => {
  // TODO...
};
```

使用 `get()` 方法并传入索引键通过索引取得单条记录

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.index('username'),
      request = index.get('007');
request.onsuccess = event => {
  // TODO...
};
```

使用 `getKey()` 方法。取得给定索引键的主键

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      index = store.index('username'),
      request = index.getKey('007');
request.onsuccess = event => {
  // TODO...
};
```

任何时候，都可以使用 `IDBIndex` 对象的下列属性取得索引的相关信息

- `name` 索引的名称
- `keyPath` 调用 `createIndex()` 时传入的属性路径
- `objectStore` 索引对应的对象存储
- `unique` 表示索引键是否唯一的布尔值

对象存储的 `indexNames` 属性，保存着与之相关索引的名称

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users'),
      indexNames = store.indexNames;
for (const indexName in indexNames) {
  const index = store.index(indexName);
  console.log(`Index name: ${index.name} KeyPath: ${index.keyPath} Unique: ${index.unique}`);
}
```

在对象存储上调用 `deleteIndex()` 方法并传入索引的名称可以删除索引

```js
const transaction = db.transaction('users'),
      store = transaction.objectStore('users');
store.deleteIndex('username');
```

