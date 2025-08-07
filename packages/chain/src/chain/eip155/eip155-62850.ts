// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_62850 = {
  name: "LAOS Sigma Testnet",
  shortName: "laossigma",
  title: "LAOS Sigma Testnet",
  chain: "LAOS Sigma Testnet",
  rpc: [
    "https://rpc.laossigma.laosfoundation.io",
    "wss://rpc.laossigma.laosfoundation.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "SIGMA",
    symbol: "SIGMA",
    decimals: 18,
  },
  infoURL: "https://laosnetwork.io",
  chainId: 62850,
  networkId: 62850,
  explorers: [
    {
      name: "blockscout",
      url: "https://sigma.explorer.laosnetwork.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
