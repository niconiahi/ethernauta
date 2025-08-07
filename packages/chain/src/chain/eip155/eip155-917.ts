// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_917 = {
  name: "Rinia",
  shortName: "tfire",
  title: "Firechain Testnet Rinia",
  chain: "FIRE",
  icon: "rinia",
  rpc: [
    "https://rinia-rpc1.thefirechain.com",
    "https://rpc-rinia.firestation.io",
  ],
  faucets: [
    "https://faucet.thefirechain.com",
    "https://faucet.firestation.io",
  ],
  nativeCurrency: {
    name: "Firechain",
    symbol: "FIRE",
    decimals: 18,
  },
  infoURL: "https://thefirechain.com",
  chainId: 917,
  networkId: 917,
  slip44: 1,
  explorers: [
    {
      name: "FireScan",
      url: "https://rinia.firescan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
