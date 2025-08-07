// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_542 = {
  name: "PAWCHAIN Testnet",
  shortName: "PAW",
  chain: "PAW",
  rpc: ["https://pawchainx.com/"],
  faucets: [],
  nativeCurrency: {
    name: "PAW",
    symbol: "PAW",
    decimals: 18,
  },
  infoURL: "https://pawchainx.com/",
  chainId: 542,
  networkId: 542,
  slip44: 1,
  explorers: [
    {
      name: "PAWCHAIN Testnet",
      url: "https://pawscan.io",
      standard: "none",
    },
  ],
} satisfies Chain
