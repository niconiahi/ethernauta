// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18888 = {
  name: "Titan (TKX)",
  shortName: "titan_tkx",
  chain: "Titan (TKX)",
  icon: "titan_tkx",
  rpc: [
    "https://titan-json-rpc.titanlab.io",
    "https://titan-json-rpc-tokyo.titanlab.io",
    "https://titan-json-rpc-seoul.titanlab.io",
    "https://titan-json-rpc-hongkong.titanlab.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Titan tkx",
    symbol: "TKX",
    decimals: 18,
  },
  infoURL: "https://titanlab.io",
  chainId: 18888,
  networkId: 18888,
  slip44: 1,
  explorers: [
    {
      name: "Titan Explorer",
      url: "https://tkxscan.io/Titan",
      standard: "none",
    },
  ],
} satisfies Chain
