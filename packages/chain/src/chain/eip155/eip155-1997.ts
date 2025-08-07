// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1997 = {
  name: "Kyoto",
  shortName: "kyoto",
  chain: "KYOTO",
  rpc: ["https://rpc.kyotochain.io"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Kyoto",
    symbol: "KYOTO",
    decimals: 18,
  },
  infoURL: "https://kyotoprotocol.io",
  chainId: 1997,
  networkId: 1997,
  slip44: 1,
  explorers: [
    {
      name: "Kyotoscan",
      url: "https://kyotoscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
