import { MDXProvider } from "@mdx-js/react"
import { NavLink, Outlet } from "react-router"
import { MDX_COMPONENTS } from "../components/mdx"

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
] as const

export default function ExamplesLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        background: "#faf5f0",
        color: "#1a1a1a",
        fontFamily: "sans-serif",
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
  )
}
