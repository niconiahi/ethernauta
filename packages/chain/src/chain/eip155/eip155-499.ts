// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_499 = {
  name: "Rupaya",
  shortName: "rupx",
  chain: "RUPX",
  rpc: ["https://rpc.rupaya.io"],
  faucets: ["https://faucet.rupaya.io"],
  nativeCurrency: {
    name: "Rupaya",
    symbol: "RUPX",
    decimals: 18,
  },
  infoURL: "https://www.rupaya.io",
  chainId: 499,
  networkId: 499,
  slip44: 499,
  explorers: [
    {
      name: "Rupaya Explorer",
      url: "https://scan.rupaya.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
