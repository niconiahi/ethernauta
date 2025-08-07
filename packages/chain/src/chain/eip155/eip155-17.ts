// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_17 = {
  name: "ThaiChain 2.0 ThaiFi",
  shortName: "tfi",
  chain: "TCH",
  rpc: ["https://rpc.thaifi.com"],
  faucets: [],
  nativeCurrency: {
    name: "Thaifi Ether",
    symbol: "TFI",
    decimals: 18,
  },
  infoURL: "https://exp.thaifi.com",
  chainId: 17,
  networkId: 17,
} satisfies Chain
