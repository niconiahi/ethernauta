// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_83872 = {
  name: "ZEDXION",
  shortName: "ZEDX",
  chain: "ZEDXION",
  icon: "zedx",
  rpc: ["https://mainnet-rpc.zedscan.net"],
  faucets: [],
  nativeCurrency: {
    name: "Zedxion",
    symbol: "ZEDX",
    decimals: 9,
  },
  infoURL: "https://docs.zedscan.net",
  chainId: 83872,
  networkId: 83872,
  explorers: [
    {
      name: "Zedscan",
      url: "http://zedscan.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
