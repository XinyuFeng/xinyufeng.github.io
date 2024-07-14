import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Links, Outlet, LiveReload, useLoaderData, Link } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { PrismaClient } from "@prisma/client";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links$2 = () => [
  //{ rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: "./app/styles/global.css" },
  {
    rel: "stylesheet",
    href: "./app/styles/global-medium.css",
    //href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)"
  },
  {
    rel: "stylesheet",
    //href: globalLargeStylesUrl,
    href: "./app/styles/global-large.css",
    media: "screen and (min-width: 1024px)"
  }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("title", { children: "Remix: so great, it's funny!" }),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(LiveReload, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links: links$2
}, Symbol.toStringTag, { value: "Module" }));
const singleton = (name, valueFactory) => {
  var _a;
  const g = global;
  g.__singletons ?? (g.__singletons = {});
  (_a = g.__singletons)[name] ?? (_a[name] = valueFactory());
  return g.__singletons[name];
};
const db = singleton("prisma", () => new PrismaClient());
const loader$2 = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId }
  });
  if (!joke) {
    throw new Error("joke not found");
  }
  return json({ joke });
};
function JokeRoute() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { children: "Here's your hilarious joke:" }),
    /* @__PURE__ */ jsx("p", { children: data.joke.content }),
    /* @__PURE__ */ jsxs(Link, { to: ".", children: [
      '"',
      data.joke.name,
      '" Permalink'
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: JokeRoute,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async () => {
  const count = await db.joke.count();
  const randRowNum = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    skip: randRowNum,
    take: 1
  });
  return json({ randomJoke });
};
function JokesIndexRoute() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { children: "Here's a random joke:" }),
    /* @__PURE__ */ jsx("p", { children: data.randomJoke.content }),
    /* @__PURE__ */ jsxs(Link, { to: data.randomJoke.id, children: [
      '"',
      data.randomJoke.name,
      '" Permalink'
    ] }),
    /* @__PURE__ */ jsx("p", { children: "I was wondering why the frisbee was getting bigger, then it hit me." })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: JokesIndexRoute,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function NewJokeRoute() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { children: "Add your own hilarious joke" }),
    /* @__PURE__ */ jsxs("form", { method: "post", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Name: ",
        /* @__PURE__ */ jsx("input", { type: "text", name: "name" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("label", { children: [
        "Content: ",
        /* @__PURE__ */ jsx("textarea", { name: "content" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { type: "submit", className: "button", children: "Add" }) })
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewJokeRoute
}, Symbol.toStringTag, { value: "Module" }));
const links$1 = () => [
  { rel: "stylesheet", href: "./app/styles/index.css" }
  // { rel: "stylesheet", href: stylesUrl },
];
function IndexRoute() {
  return /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs("div", { className: "content", children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      "Remix ",
      /* @__PURE__ */ jsx("span", { children: "Jokes!" })
    ] }),
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx("ul", { children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "jokes", children: "Read Jokes" }) }) }) })
  ] }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IndexRoute,
  links: links$1
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "stylesheet", href: "./styles/jokes.css" }
];
const loader = async () => {
  return json({ jokeListItems: await db.joke.findMany() });
};
function JokesRoute() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "jokes-layout", children: [
    /* @__PURE__ */ jsx("header", { className: "jokes-header", children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsx("h1", { className: "home-link", children: /* @__PURE__ */ jsxs(Link, { to: "/", title: "Remix Jokes", "aria-label": "Remix Jokes", children: [
      /* @__PURE__ */ jsx("span", { className: "logo", children: "🤪" }),
      /* @__PURE__ */ jsx("span", { className: "logo-medium", children: "J🤪KES" })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("main", { className: "jokes-main", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs("div", { className: "jokes-list", children: [
        /* @__PURE__ */ jsx(Link, { to: ".", children: "Get a random joke" }),
        /* @__PURE__ */ jsx("p", { children: "Here are a few more jokes to check out:" }),
        /* @__PURE__ */ jsx("ul", { children: data.jokeListItems.map(({ id, name }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: id, children: name }) }, id)) }),
        /* @__PURE__ */ jsx(Link, { to: "new", className: "button", children: "Add your own" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "jokes-outlet", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] }) })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: JokesRoute,
  links,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CycovZPd.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-qbL2edy0.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": ["/assets/root-CPWv79EU.css"] }, "routes/jokes.$jokeId": { "id": "routes/jokes.$jokeId", "parentId": "routes/jokes", "path": ":jokeId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/jokes._jokeId-vidc0yEN.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": [] }, "routes/jokes._index": { "id": "routes/jokes._index", "parentId": "routes/jokes", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/jokes._index-DIPj5rrz.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": [] }, "routes/jokes.new": { "id": "routes/jokes.new", "parentId": "routes/jokes", "path": "new", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/jokes.new-BMeyDpnj.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index--sxJR8Td.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": [] }, "routes/jokes": { "id": "routes/jokes", "parentId": "root", "path": "jokes", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/jokes-D-jusj54.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-DDd4d-UM.js"], "css": [] } }, "url": "/assets/manifest-9a91c574.js", "version": "9a91c574" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_fogOfWar": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/jokes.$jokeId": {
    id: "routes/jokes.$jokeId",
    parentId: "routes/jokes",
    path: ":jokeId",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/jokes._index": {
    id: "routes/jokes._index",
    parentId: "routes/jokes",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/jokes.new": {
    id: "routes/jokes.new",
    parentId: "routes/jokes",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
  },
  "routes/jokes": {
    id: "routes/jokes",
    parentId: "root",
    path: "jokes",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
