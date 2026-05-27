import "./styles/tokens.css"
import "./styles/text_styles.css"
import "./styles/button.css"
import "./styles/tailwind.css"
import "./styles/global.css"

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router"

import type { Route } from "./+types/root"
import { ConnectWalletButton } from "./components/connect-wallet-button"
import { read_session_cookie } from "./lib/auth/session.server"

export async function loader({
  request,
  context,
}: Route.LoaderArgs) {
  const session = await read_session_cookie(
    request,
    context.cloudflare.env,
  )
  return {
    session: session
      ? {
          address: session.address,
          chainId: session.chainId,
        }
      : null,
  }
}

export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
]

export function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { session } = useLoaderData<typeof loader>()
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "80px 1fr",
        minHeight: "100vh",
        fontFamily: "var(--font-family-body)",
        color: "var(--text)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        <Link
          to="/"
          aria-label="Ethernauta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: "var(--text)",
            textDecoration: "none",
            lineHeight: 0,
          }}
        >
          <img
            src="/logo.svg"
            alt=""
            width={56}
            height={56}
            style={{
              background: "var(--neutral-950)",
              borderRadius: 10,
              padding: 6,
            }}
          />
        </Link>
        <ConnectWalletButton session={session} />
      </header>
      <Outlet />
    </div>
  )
}

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (
    import.meta.env.DEV &&
    error &&
    error instanceof Error
  ) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
