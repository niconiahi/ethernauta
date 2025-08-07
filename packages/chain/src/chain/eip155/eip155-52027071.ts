// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_52027071 = {
  name: "Deviant Token Blockchain",
  shortName: "dtbc",
  chain: "DTBC",
  rpc: ["https://rpc.devianttoken.net"],
  faucets: [],
  nativeCurrency: {
    name: "Deviant Token",
    symbol: "DTBC",
    decimals: 18,
  },
  infoURL: "https://devianttoken.net",
  chainId: 52027071,
  networkId: 52027071,
  explorers: [],
  status: "incubating",
} satisfies Chain
