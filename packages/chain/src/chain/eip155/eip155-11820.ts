// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_11820 = {
  name: "Artela Mainnet",
  shortName: "artela-mainnet",
  chain: "Artela",
  icon: "artela",
  rpc: ["https://node-euro.artela.network/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "ART",
    symbol: "ART",
    decimals: 18,
  },
  infoURL: "https://artela.network/",
  chainId: 11820,
  networkId: 11820,
  explorers: [
    {
      name: "ArtelaScan",
      url: "https://artscan.artela.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
