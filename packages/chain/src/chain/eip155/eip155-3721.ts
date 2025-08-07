// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3721 = {
  name: "Xone Mainnet",
  shortName: "XOC",
  chain: "XOC",
  icon: "Xonechain",
  rpc: ["https://rpc.xone.org", "wss://rpc-wss.xone.org"],
  faucets: ["https://faucet.xone.org/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Xone Coin",
    symbol: "XOC",
    decimals: 18,
  },
  infoURL: "https://xone.org",
  chainId: 3721,
  networkId: 3721,
  explorers: [
    {
      name: "Xonescan",
      url: "https://xscscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
