// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1689 = {
  name: "NERO Mainnet",
  shortName: "NERO",
  chain: "NERO Chain",
  icon: "nero",
  rpc: [
    "https://rpc.nerochain.io",
    "wss://ws.nerochain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "NERO",
    symbol: "NERO",
    decimals: 18,
  },
  infoURL: "https://docs.nerochain.io/",
  chainId: 1689,
  networkId: 1689,
  slip44: 1,
  explorers: [
    {
      name: "nero mainnet scan",
      url: "https://www.neroscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
