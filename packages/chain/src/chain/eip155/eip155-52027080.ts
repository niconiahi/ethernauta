// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_52027080 = {
  name: "Deviant Token Blockchain Testnet",
  shortName: "tdtbc",
  chain: "tDTBC",
  rpc: ["https://trpc.devianttoken.net"],
  faucets: [],
  nativeCurrency: {
    name: "Deviant Token Testnet",
    symbol: "tDTBC",
    decimals: 18,
  },
  infoURL: "https://devianttoken.net",
  chainId: 52027080,
  networkId: 52027080,
  explorers: [],
  status: "incubating",
} satisfies Chain
