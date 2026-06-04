import "./examples.css"
import { MDXProvider } from "@mdx-js/react"
import { NavLink, Outlet } from "react-router"

import { GithubLink } from "../components/github-link"
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
  {
    to: "/examples/paymaster-7677",
    title: "ERC-7677 paymaster",
  },
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
    to: "/examples/eip-5267",
    title: "EIP-5267 domain getter",
  },
  {
    to: "/examples/ccip-read-3668",
    title: "EIP-3668 CCIP-Read",
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
    to: "/examples/eip-1967",
    title: "EIP-1967 proxy slots",
  },
  {
    to: "/examples/eip-1167",
    title: "EIP-1167 minimal proxy",
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
    to: "/examples/emitter",
    title: "EIP-1193 emitter",
  },
] as const

const OTHER_EXAMPLES = [
  {
    to: "/examples/provider-reads",
    title: "provider.reader reads",
  },
  {
    to: "/examples/state-overrides",
    title: "eth_call state overrides",
  },
  {
    to: "/examples/finalized-block",
    title: "finalized block tag",
  },
  {
    to: "/examples/debug-tracers",
    title: "debug_* tracers",
  },
] as const

const RECIPE_EXAMPLES = [
  {
    to: "/examples/sponsored-basename-transfer",
    title: "Sponsored basename transfer",
  },
] as const

const ROLLUP_OP_EXAMPLES = [
  {
    to: "/examples/bridge-send-eth",
    title: "send_eth",
  },
  {
    to: "/examples/bridge-send-erc20",
    title: "send_erc20",
  },
  {
    to: "/examples/bridge-send-message",
    title: "send_message",
  },
  {
    to: "/examples/bridge-withdraw-eth",
    title: "withdraw_eth",
  },
] as const

const ROLLUP_ARBITRUM_EXAMPLES = [
  {
    to: "/examples/bridge-arbitrum-send-eth",
    title: "send_eth",
  },
  {
    to: "/examples/bridge-arbitrum-send-erc20",
    title: "send_erc20",
  },
  {
    to: "/examples/bridge-arbitrum-retryable",
    title: "retryable lifecycle",
  },
  {
    to: "/examples/bridge-arbitrum-withdraw-eth",
    title: "withdraw_eth lifecycle",
  },
] as const

const ROLLUP_ZKSYNC_EXAMPLES = [
  {
    to: "/examples/bridge-zksync-send-eth",
    title: "send_eth",
  },
  {
    to: "/examples/bridge-zksync-send-erc20",
    title: "send_erc20",
  },
  {
    to: "/examples/bridge-zksync-claim-failed-deposit",
    title: "claim_failed_deposit lifecycle",
  },
  {
    to: "/examples/bridge-zksync-withdraw-eth",
    title: "withdraw_eth lifecycle",
  },
] as const

const ROLLUP_SUBSECTIONS = [
  { heading: "OP", items: ROLLUP_OP_EXAMPLES },
  { heading: "Arbitrum", items: ROLLUP_ARBITRUM_EXAMPLES },
  { heading: "zkSync", items: ROLLUP_ZKSYNC_EXAMPLES },
] as const

const UTILITY_EXAMPLES = [
  { to: "/examples/multicall", title: "Multicall" },
  {
    to: "/examples/event-decoding",
    title: "Event decoding",
  },
  {
    to: "/examples/gas-estimate",
    title: "Gas estimation (1559)",
  },
  {
    to: "/examples/gas-estimate-op-stack",
    title: "Gas estimation (OP-stack)",
  },
  {
    to: "/examples/gas-estimate-arbitrum",
    title: "Gas estimation (Arbitrum)",
  },
  {
    to: "/examples/gas-estimate-zksync",
    title: "Gas estimation (zkSync)",
  },
] as const

const TAIL_SECTIONS = [
  { heading: "Utilities", items: UTILITY_EXAMPLES },
  { heading: "ERCs", items: ERC_EXAMPLES },
  { heading: "EIPs", items: EIP_EXAMPLES },
  { heading: "Others", items: OTHER_EXAMPLES },
] as const

function ExamplesNav({
  items,
}: {
  items: ReadonlyArray<{ to: string; title: string }>
}) {
  return (
    <nav className="examples-nav">
      {items.map((e) => (
        <NavLink
          key={e.to}
          to={e.to}
          className={({ isActive }) =>
            isActive
              ? "examples-nav-link is-active"
              : "examples-nav-link"
          }
        >
          {e.title}
        </NavLink>
      ))}
    </nav>
  )
}

export default function ExamplesLayout() {
  return (
    <div className="examples-layout">
      <aside className="examples-sidebar">
        <GithubLink
          label="Star on GitHub"
          className="examples-sidebar-github"
        />
        <div className="examples-section">
          <h2 className="examples-section-title">
            Recipes
          </h2>
          <ExamplesNav items={RECIPE_EXAMPLES} />
        </div>
        <div className="examples-section">
          <h2 className="examples-section-title">
            Rollups
          </h2>
          {ROLLUP_SUBSECTIONS.map((sub) => (
            <div
              key={sub.heading}
              className="examples-subsection"
            >
              <h3 className="examples-subsection-title">
                {sub.heading}
              </h3>
              <ExamplesNav items={sub.items} />
            </div>
          ))}
        </div>
        {TAIL_SECTIONS.map((section) => (
          <div
            key={section.heading}
            className="examples-section"
          >
            <h2 className="examples-section-title">
              {section.heading}
            </h2>
            <ExamplesNav items={section.items} />
          </div>
        ))}
      </aside>
      <main className="examples-main">
        <MDXProvider components={MDX_COMPONENTS}>
          <Outlet />
        </MDXProvider>
      </main>
    </div>
  )
}
