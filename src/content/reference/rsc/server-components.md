---
title: 服务器组件
---

<RSC>

服务器组件被用在 [React 服务器组件](/learn/start-a-new-react-project#full-stack-frameworks) 中。

</RSC>

<Intro>

服务器组件是一种新型的组件，它在打包之前，在独立于客户端应用程序或 SSR 服务器的环境中提前渲染。

</Intro>

React 服务器组件中的「服务器」就是指这个独立的环境。服务器组件可以在构建时在你的 CI 服务器上运行一次，也可以在每次请求时在 Web 服务器中运行。

<InlineToc />

<Note>

#### 我如何构建对服务器组件的支持？ {/*how-do-i-build-support-for-server-components*/}

虽然 React 19 中的 React 服务器组件是稳定的，并且在小版本之间不会发生破坏，但用于实现 React 服务器组件打包器或框架的底层 API 不遵循 semver，并可能在 React 19.x 的小版本之间发生破坏。

为了支持 React 服务器组件作为打包器或框架，我们建议固定到特定的 React 版本，或者使用 Canary 发行版。我们将继续与打包器和框架合作，以在未来稳定用于实现 React 服务器组件的 API。

</Note>

### 不使用服务器的服务器组件 {/*server-components-without-a-server*/}
服务器组件可以在构建时运行，来从文件系统中读取文件，或者获取静态内容，这种情况下，不需要 Web 服务器。例如，你可能会想从内容管理系统（Content Management System/CMS）中读取静态的数据。

如果不使用服务器组件，通常会在客户端通过一个 Effect 来获取静态数据：
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // 注意: 在第一次页面渲染 **之后** 加载。
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

这种模式意味着用户需要下载并解析额外 75K（压缩后）大小的包，还要在页面加载后等待第二次获取数据的请求，做这些仅仅是为了渲染静态内容，而这些内容在整个页面的生命周期内都不会改变。

使用服务器组件，你可以在构建时一次性渲染这些组件：

```js
import marked from 'marked'; // 不会包括在 bundle 中
import sanitizeHtml from 'sanitize-html'; // 不会包括在 bundle 中

async function Page({page}) {
  // 注意: 会在应用构建的 **渲染过程中** 加载
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

渲染的输出接着可以被服务端渲染（SSR）成 HTML 并上传至 CDN。当应用加载时，客户端不会看到原始的 `Page` 组件，也不会看到用于渲染 markdown 且体积较大的包。客户端只会看到最终渲染出来的 HTML 内容：

```js
<div><!-- html for markdown --></div>
```

这意味着内容在第一次页面加载时就可以被看见，而且 bundle 中不会包含渲染静态内容所需的体积大的包。

<Note>

你可能会注意到上方的服务器组件是一个异步函数：

```js
async function Page({page}) {
  //...
}
```

异步组件是服务器组件的一个新特性，它允许你在渲染中 `await`。

查看下方 [使用服务器组件的异步组件](#async-components-with-server-components)。

</Note>

### 使用服务器的服务器组件 {/*server-components-with-a-server*/}
服务器组件也可以在请求页面时在 Web 服务器上运行，从而让你不需要建立 API 就可以访问数据层。这类服务器组件在应用打包之前被渲染，并且可以将数据和 JSX 作为 props 传递给客户端组件。

如果不使用服务器组件，通常会在客户端的 Effect 里获取动态数据：

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // 注意: 在第一次渲染 **之后** 加载。
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // 注意: 在 Note 渲染 **之后** 加载。
  // 造成昂贵的客户端-服务器瀑布
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

使用服务器组件，你可以在组件中读取数据并渲染：

```js
import db from './database';

async function Note({id}) {
  // 注意: 在 **渲染时** 加载。
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // 注意: 在 Note **之后** 加载，
  // 如果服务器组件和数据库在同一个位置（例如在同一台服务器上），这里读取数据的加载速度会很快。
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

打包器接着会整合数据、渲染服务器组件并和动态客户端组件一起打成一个包。接着可以选择将这个包进行服务端渲染（SSR）以创建初始的 HTML 页面。当页面加载时，浏览器不会看到原始的 `Note` 和 `Author` 组件，只有渲染后的输出才会发送到客户端：

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

可以通过重新请求服务器来使服务器组件动态化，重新请求时，它们可以访问数据并重新渲染。这种新的应用结构将以服务器为中心多页应用的「请求/响应」心智模型和以客户端为中心单页应用的无缝交互性的优点融合在一起，给你提供两全其美的体验。

### 给服务器组件添加交互性 {/*adding-interactivity-to-server-components*/}

由于服务器组件不会发给浏览器，所以它们不能使用交互的 API，例如 `useState`。要给服务器组件添加交互性，你可以使用 `"use client"` 指令把他们和客户端组件组合在一起。

<Note>

#### 服务器组件没有对应的指令 {/*there-is-no-directive-for-server-components*/}

一个常见的误解是，服务器组件使用 `"use server"` 表示，但其实服务器组件没有对应的指令。`"use server"` 是给服务器函数使用的。

要了解更多信息，查看 [指令](/reference/rsc/directives) 的文档.

</Note>


在如下示例中，`Notes` 服务器组件导入了 `Expandable` 客户端组件，这个组件使用 state 切换 `expanded` 状态：
```js
// 服务器组件
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// 客户端组件
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

其工作原理是，首先将 `Notes` 作为服务器组件渲染，然后指引打包器为客户端组件 `Expandable` 创建一个包。在浏览器中，客户端组件会接收服务器组件的输出并作为 props 传递。

```js
<head>
  <!-- 客户端组件的包 -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### 使用服务器组件的异步组件 {/*async-components-with-server-components*/}

服务器组件引入了一种使用 async/await 编写组件的新方法。当你在一个异步组件里 `await` 时，React 会暂停，等待 promise 解析完成后再继续渲染。这种等待可以跨越服务器和客户端的边界生效，并且支持 Suspense 的流式传输。

你甚至可以在服务器上创建一个 promise，然后再客户端上 await 它。

```js
// 服务器组件
import db from './database';

async function Page({id}) {
  // 使用 await 会使服务器组件暂停
  const note = await db.notes.get(id);

  // 注意: 没有使用 await, 所以从这里开始执行，但是客户端上面进行 await
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// 客户端组件
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // 注意: 这样做会复用服务器上的 promise
  // 它会一直等到数据可用之后才继续
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

因为 `note` 内容是页面渲染所需的重要数据，所以我们在服务器上进行 `await`。comments 数据在折叠部分中，优先级较低，所以我们在服务器上开始 promise，然后在客户端使用 `use` API 进行等待。这会在客户端上暂停，但不会阻塞 `note` 内容的渲染。

由于异步组件在客户端不受支持，所以我们通过 `use` 来 await promise。
