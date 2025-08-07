// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2004 = {
  name: "MetaLink Network",
  shortName: "mtl",
  chain: "MetaLink",
  icon: "metaLink",
  rpc: ["http://77.237.237.69:9933"],
  faucets: [],
  nativeCurrency: {
    name: "MetaLink",
    symbol: "MTL",
    decimals: 18,
  },
  infoURL: "http://totwo3.com:3000",
  chainId: 2004,
  networkId: 2004,
  explorers: [
    {
      name: "MetaScan",
      url: "http://twoto3.com:3000",
      standard: "none",
    },
  ],
} satisfies Chain
