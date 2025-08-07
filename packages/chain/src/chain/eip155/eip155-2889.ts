// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2889 = {
  name: "Aarma Mainnet",
  shortName: "ARMA",
  chain: "Aarma",
  icon: "arma",
  rpc: ["https://aarmarpc.com/"],
  faucets: [],
  nativeCurrency: {
    name: "Aarma",
    symbol: "ARMA",
    decimals: 18,
  },
  infoURL: "https://aarmachain.com",
  chainId: 2889,
  networkId: 2889,
  explorers: [
    {
      name: "aarmascan",
      url: "https://aarmascan.com",
      standard: "none",
    },
  ],
} satisfies Chain
