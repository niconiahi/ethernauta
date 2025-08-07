// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18889 = {
  name: "Titan (TKX) Testnet",
  shortName: "titan_tkx-testnet",
  chain: "Titan (TKX)",
  icon: "titan_tkx",
  rpc: [
    "https://titan-testnet-json-rpc.titanlab.io",
    "https://titan-testnet-json-rpc-1.titanlab.io",
    "https://titan-testnet-json-rpc-2.titanlab.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Titan tkx",
    symbol: "TKX",
    decimals: 18,
  },
  infoURL: "https://titanlab.io",
  chainId: 18889,
  networkId: 18889,
  slip44: 1,
  explorers: [
    {
      name: "Titan Explorer",
      url: "https://titan-testnet-explorer-light.titanlab.io/Titan%20Testnet",
      standard: "none",
    },
  ],
} satisfies Chain
