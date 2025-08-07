// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1507 = {
  name: "Sherpax Testnet",
  shortName: "SherpaxTestnet",
  chain: "Sherpax Testnet",
  rpc: ["https://sherpax-testnet.chainx.org/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "KSX",
    symbol: "KSX",
    decimals: 18,
  },
  infoURL: "https://sherpax.io/",
  chainId: 1507,
  networkId: 1507,
  slip44: 1,
  explorers: [
    {
      name: "Sherpax Testnet Explorer",
      url: "https://evm-pre.sherpax.io",
      standard: "none",
    },
  ],
} satisfies Chain
