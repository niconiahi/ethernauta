// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_413413 = {
  name: "AIE Testnet",
  shortName: "aie",
  chain: "AIE",
  icon: "aie",
  rpc: ["https://rpc1-testnet.aiechain.io"],
  faucets: [],
  nativeCurrency: {
    name: "AIE",
    symbol: "AIE",
    decimals: 18,
  },
  infoURL: "https://testnet.aiescan.io",
  chainId: 413413,
  networkId: 413413,
  explorers: [
    {
      name: "aiescan-testnet",
      url: "https://testnet.aiescan.io",
      standard: "none",
    },
  ],
} satisfies Chain
