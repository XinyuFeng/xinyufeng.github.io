import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  LiveReload,
} from "@remix-run/react";
import "./tailwind.css";
//import globalLargeStylesUrl from "./styles/global-large.css";
//import globalMediumStylesUrl from "./styles/global-medium.css";
//import globalStylesUrl from "~/styles/global-o.css";
import { LinksFunction } from "@remix-run/react/dist/routeModules";
import JokesIndexRoute from "./routes/jokes._index";

export const links: LinksFunction = () => [
  //{ rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: "./app/styles/global.css" },
  {
    rel: "stylesheet",
    href: "./app/styles/global-medium.css",
    //href: globalMediumStylesUrl,
    media: "print, (min-width: 640px)",
  },
  {
    rel: "stylesheet",
    //href: globalLargeStylesUrl,
    href: "./app/styles/global-large.css",
    media: "screen and (min-width: 1024px)",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Remix: so great, it&apos;s funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
