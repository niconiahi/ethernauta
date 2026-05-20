import {
  index,
  type RouteConfig,
  route,
} from "@react-router/dev/routes"

export default [
  index("./routes/home.tsx"),
  route("privacy-policy", "./routes/privacy-policy.tsx"),
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
  ]),
] satisfies RouteConfig
