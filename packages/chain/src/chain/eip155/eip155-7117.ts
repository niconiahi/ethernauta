// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7117 = {
  name: "0XL3",
  shortName: "0xl3",
  chain: "0XL3",
  icon: "0xl3",
  rpc: ["https://rpc.0xl3.com"],
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
    name: "XL3",
    symbol: "XL3",
    decimals: 18,
  },
  infoURL: "https://0xl3.com",
  chainId: 7117,
  networkId: 7117,
  explorers: [
    {
      name: "0XL3 Explorer",
      url: "https://exp.0xl3.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
