import { MDXProvider } from "@mdx-js/react"
import { NavLink, Outlet } from "react-router"

import { MDX_COMPONENTS } from "../components/mdx"

const ERC_EXAMPLES = [
  { to: "/examples/portfolio", title: "ERC-20 portfolio" },
  {
    to: "/examples/nft-introspection",
    title: "ERC-165 introspection",
  },
  { to: "/examples/vaults", title: "ERC-4626 vaults" },
  {
    to: "/examples/permit",
    title: "ERC-2612 permit signing",
  },
  {
    to: "/examples/cross-chain-7683",
    title: "ERC-7683 cross-chain intents",
  },
  {
    to: "/examples/stealth-5564",
    title: "ERC-5564 stealth addresses",
  },
  { to: "/examples/ens-137", title: "ERC-137 ENS" },
] as const

const EIP_EXAMPLES = [
  {
    to: "/examples/delegate-7702",
    title: "EIP-7702 batched calls",
  },
  {
    to: "/examples/send-calls",
    title: "EIP-5792 send calls",
  },
  {
    to: "/examples/user-op-4337",
    title: "EIP-4337 user operation",
  },
  {
    to: "/examples/verify-1271",
    title: "EIP-1271 verify",
  },
  {
    to: "/examples/verify-6492",
    title: "EIP-6492 wrap",
  },
  {
    to: "/examples/deploy-contract",
    title: "EIP-1014 deploy",
  },
  {
    to: "/examples/eip-6963",
    title: "EIP-6963 discovery",
  },
  {
    to: "/examples/eip-1193",
    title: "EIP-1193 provider",
  },
  {
    to: "/examples/provider-reads",
    title: "provider.reader reads",
  },
] as const

const UTILITY_EXAMPLES = [
  { to: "/examples/multicall", title: "Multicall" },
  {
    to: "/examples/event-decoding",
    title: "Event decoding",
  },
] as const

const SECTIONS = [
  { heading: "Utilities", items: UTILITY_EXAMPLES },
  { heading: "ERCs", items: ERC_EXAMPLES },
  { heading: "EIPs", items: EIP_EXAMPLES },
] as const

export default function ExamplesLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        background: "#faf5f0",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #ddd",
          padding: "32px 16px",
          background: "#fff",
        }}
      >
        {SECTIONS.map((section, i) => (
          <div
            key={section.heading}
            style={{ marginTop: i === 0 ? 0 : 24 }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 12px",
              }}
            >
              {section.heading}
            </h2>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {section.items.map((e) => (
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
          </div>
        ))}
      </aside>
      <main style={{ padding: "48px 64px" }}>
        <MDXProvider components={MDX_COMPONENTS}>
          <Outlet />
        </MDXProvider>
      </main>
    </div>
  )
}
