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
  ]),
] satisfies RouteConfig
