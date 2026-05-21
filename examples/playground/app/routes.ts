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
    route(
      "injected-1193",
      "./routes/examples/injected-1193.mdx",
    ),
  ]),
] satisfies RouteConfig
