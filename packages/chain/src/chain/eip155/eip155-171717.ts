// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_171717 = {
  name: "Wadzchain Mainnet",
  shortName: "wadzchain-mainnet",
  title: "Wadzchain Mainnet",
  chain: "Wadzchain-Mainnet",
  icon: "wadz",
  rpc: ["https://rpc.wadzchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "WadzChain Token",
    symbol: "WCO",
    decimals: 18,
  },
  infoURL: "https://www.wadzchain-network.io",
  chainId: 171717,
  networkId: 171717,
  explorers: [
    {
      name: "Wadzchain Mainnet Explorer",
      url: "https://scan.wadzchain.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
