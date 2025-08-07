// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1962 = {
  name: "T-Rex Testnet",
  shortName: "TREX",
  chain: "T-Rex",
  icon: "trex",
  rpc: ["https://testnetrpc.trex.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://trex.xyz/",
  chainId: 1962,
  networkId: 1962,
  explorers: [
    {
      name: "T-Rex Testnet explorer",
      url: "https://testnet.trex.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
