// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1008686 = {
  name: "Naga Testnet",
  shortName: "Naga",
  chain: "Naga",
  icon: "naga",
  rpc: [
    "https://rpc.nagafintech.com",
    "wss://rpc.nagafintech.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Naga",
    symbol: "Naga",
    decimals: 18,
  },
  infoURL: "https://stablecoin.nagafintech.com/#/app/home",
  chainId: 1008686,
  networkId: 1008686,
  explorers: [
    {
      name: "Naga Explorer Testnet",
      url: "https://explorer.nagafintech.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
