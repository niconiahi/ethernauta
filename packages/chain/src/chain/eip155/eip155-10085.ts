// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10085 = {
  name: "Volcano Chain Mainnet",
  shortName: "volcanochain",
  chain: "Volcano",
  icon: "volcano",
  rpc: [
    "https://mainnet.vchain.pro",
    "wss://wss.mainnet.vchain.pro",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Volcano Coin",
    symbol: "VC",
    decimals: 18,
  },
  infoURL: "https://vex.pro",
  chainId: 10085,
  networkId: 10085,
  explorers: [
    {
      name: "blockscout",
      url: "https://vchainscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
