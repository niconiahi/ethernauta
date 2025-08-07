// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_151 = {
  name: "Redbelly Network Mainnet",
  shortName: "rbn",
  chain: "RBN",
  icon: "redbelly",
  rpc: ["https://governors.mainnet.redbelly.network"],
  faucets: [],
  nativeCurrency: {
    name: "Redbelly Network Coin",
    symbol: "RBNT",
    decimals: 18,
  },
  infoURL: "https://redbelly.network",
  chainId: 151,
  networkId: 151,
  slip44: 824,
  explorers: [
    {
      name: "Routescan",
      url: "https://redbelly.routescan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
