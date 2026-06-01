import {
  index,
  type RouteConfig,
  route,
} from "@react-router/dev/routes"

export default [
  index("./routes/home.tsx"),
  route("privacy-policy", "./routes/privacy-policy.tsx"),
  route(
    "api/auth/siwe/nonce",
    "./routes/api/auth/siwe/nonce.ts",
  ),
  route(
    "api/auth/siwe/verify",
    "./routes/api/auth/siwe/verify.ts",
  ),
  route(
    "api/auth/siwe/logout",
    "./routes/api/auth/siwe/logout.ts",
  ),
  route("examples", "./routes/examples.tsx", [
    index("./routes/examples/index.tsx"),
    route("eip-1167", "./routes/examples/eip-1167.mdx"),
    route("eip-1967", "./routes/examples/eip-1967.mdx"),
    route("eip-5267", "./routes/examples/eip-5267.mdx"),
    route(
      "state-overrides",
      "./routes/examples/state-overrides.mdx",
    ),
    route(
      "finalized-block",
      "./routes/examples/finalized-block.mdx",
    ),
    route("multicall", "./routes/examples/multicall.mdx"),
    route("portfolio", "./routes/examples/portfolio.mdx"),
    route(
      "nft-introspection",
      "./routes/examples/nft-introspection.mdx",
    ),
    route("vaults", "./routes/examples/vaults.mdx"),
    route("permit", "./routes/examples/permit.mdx"),
    route(
      "delegate-7702",
      "./routes/examples/delegate-7702.mdx",
    ),
    route("send-calls", "./routes/examples/send-calls.mdx"),
    route(
      "cross-chain-7683",
      "./routes/examples/cross-chain-7683.mdx",
    ),
    route(
      "user-op-4337",
      "./routes/examples/user-op-4337.mdx",
    ),
    route(
      "stealth-5564",
      "./routes/examples/stealth-5564.mdx",
    ),
    route("ens-137", "./routes/examples/ens-137.mdx"),
    route(
      "verify-1271",
      "./routes/examples/verify-1271.mdx",
    ),
    route(
      "verify-6492",
      "./routes/examples/verify-6492.mdx",
    ),
    route(
      "event-decoding",
      "./routes/examples/event-decoding.mdx",
    ),
    route(
      "deploy-contract",
      "./routes/examples/deploy-contract.mdx",
    ),
    route("eip-6963", "./routes/examples/eip-6963.mdx"),
    route("eip-1193", "./routes/examples/eip-1193.mdx"),
    route("emitter", "./routes/examples/emitter.mdx"),
    route(
      "provider-reads",
      "./routes/examples/provider-reads.mdx",
    ),
    route(
      "gas-estimate",
      "./routes/examples/gas-estimate.mdx",
    ),
    route(
      "gas-estimate-op-stack",
      "./routes/examples/gas-estimate-op-stack.mdx",
    ),
    route(
      "gas-estimate-arbitrum",
      "./routes/examples/gas-estimate-arbitrum.mdx",
    ),
    route(
      "gas-estimate-zksync",
      "./routes/examples/gas-estimate-zksync.mdx",
    ),
    route(
      "sponsored-basename-transfer",
      "./routes/examples/sponsored-basename-transfer.mdx",
    ),
    route(
      "ccip-read-3668",
      "./routes/examples/ccip-read-3668.mdx",
    ),
    route(
      "paymaster-7677",
      "./routes/examples/paymaster-7677.mdx",
    ),
    route(
      "debug-tracers",
      "./routes/examples/debug-tracers.mdx",
    ),
    route(
      "bridge-send-eth",
      "./routes/examples/bridge-send-eth.mdx",
    ),
  ]),
] satisfies RouteConfig
