// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_58680 = {
  name: "Lumoz Quidditch Testnet",
  shortName: "Lumoz-Quidditch-Testnet",
  chain: "ETH",
  icon: "opside-new",
  rpc: ["https://quidditch-rpc.lumoz.org"],
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
    name: "Lumoz Quidditch Testnet Token",
    symbol: "MOZ",
    decimals: 18,
  },
  infoURL: "https://lumoz.org",
  chainId: 58680,
  networkId: 58680,
  slip44: 1,
  explorers: [
    {
      name: "LumozQuidditchTestnetInfo",
      url: "https://quidditch.lumoz.info",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
