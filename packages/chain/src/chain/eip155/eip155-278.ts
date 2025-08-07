// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_278 = {
  name: "xFair.AI Mainnet",
  shortName: "fai",
  chain: "FAI",
  rpc: [
    "https://rpc_mainnet.xfair.ai",
    "wss://rpc_mainnet.xfair.ai",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "FAI",
    symbol: "FAI",
    decimals: 18,
  },
  infoURL: "https://xfair.ai",
  chainId: 278,
  networkId: 278,
} satisfies Chain
