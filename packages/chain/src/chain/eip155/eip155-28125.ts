// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_28125 = {
  name: "XferChain Mainnet",
  shortName: "DPm",
  chain: "XferChain Mainnet",
  icon: "xferIcon",
  rpc: ["https://rpc.xferchain.org"],
  faucets: [],
  nativeCurrency: {
    name: "Dapo",
    symbol: "Dapo",
    decimals: 18,
  },
  infoURL: "https://xferchain.org",
  chainId: 28125,
  networkId: 28125,
  explorers: [
    {
      name: "XferChain Mainnet Explorer",
      url: "https://network.xferchain.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
