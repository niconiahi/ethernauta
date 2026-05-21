import { MDXProvider } from "@mdx-js/react"
import {
  NavLink,
  Outlet,
  useLoaderData,
} from "react-router"

import type { Route } from "./+types/examples"
import { ConnectWalletButton } from "../components/connect-wallet-button"
import { MDX_COMPONENTS } from "../components/mdx"
import { read_session_cookie } from "../lib/auth/session.server"

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

const EXAMPLES = [
  { to: "/examples/multicall", title: "Multicall" },
  { to: "/examples/portfolio", title: "Portfolio" },
  {
    to: "/examples/nft-introspection",
    title: "NFT introspection",
  },
  { to: "/examples/vaults", title: "ERC-4626 vaults" },
  { to: "/examples/permit", title: "Permit signing" },
  {
    to: "/examples/delegate-7702",
    title: "EIP-7702 batched calls",
  },
  {
    to: "/examples/send-calls",
    title: "ERC-5792 send calls",
  },
  {
    to: "/examples/cross-chain-7683",
    title: "ERC-7683 cross-chain intents",
  },
  {
    to: "/examples/user-op-4337",
    title: "ERC-4337 user operation",
  },
  {
    to: "/examples/stealth-5564",
    title: "ERC-5564 stealth addresses",
  },
  { to: "/examples/ens-137", title: "ERC-137 ENS" },
  {
    to: "/examples/verify-1271",
    title: "EIP-1271 verify",
  },
  {
    to: "/examples/verify-6492",
    title: "EIP-6492 wrap",
  },
  {
    to: "/examples/event-decoding",
    title: "Event decoding",
  },
  {
    to: "/examples/deploy-contract",
    title: "EIP-1014 deploy",
  },
  {
    to: "/examples/injected-1193",
    title: "EIP-1193 + 6963",
  },
] as const

export default function ExamplesLayout() {
  const { session } = useLoaderData<typeof loader>()
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "56px 1fr",
        minHeight: "100vh",
        background: "#faf5f0",
        color: "#1a1a1a",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14 }}>
          Ethernauta examples
        </span>
        <ConnectWalletButton session={session} />
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
        }}
      >
        <aside
          style={{
            borderRight: "1px solid #ddd",
            padding: "32px 16px",
            background: "#fff",
          }}
        >
          <NavLink
            to="/"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 24,
              textDecoration: "none",
            }}
          >
            ← Back home
          </NavLink>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 12px",
            }}
          >
            Examples
          </h2>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {EXAMPLES.map((e) => (
              <NavLink
                key={e.to}
                to={e.to}
                style={({ isActive }) => ({
                  padding: "8px 12px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#1a1a1a",
                  background: isActive
                    ? "#FF5005"
                    : "transparent",
                })}
              >
                {e.title}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main style={{ padding: "48px 64px" }}>
          <MDXProvider components={MDX_COMPONENTS}>
            <Outlet />
          </MDXProvider>
        </main>
      </div>
    </div>
  )
}
