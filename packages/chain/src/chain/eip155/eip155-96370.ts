// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_96370 = {
  name: "Lumoz Chain Mainnet",
  shortName: "Lumoz-Chain-Mainnet",
  chain: "ETH",
  icon: "opside-new",
  rpc: [
    "https://rpc.lumoz.org",
    "https://rpc-hk.lumoz.org",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Lumoz Mainnet Token",
    symbol: "MOZ",
    decimals: 18,
  },
  infoURL: "https://lumoz.org",
  chainId: 96370,
  networkId: 96370,
  slip44: 1,
  explorers: [
    {
      name: "LumozMainnetInfo",
      url: "https://scan.lumoz.info",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
