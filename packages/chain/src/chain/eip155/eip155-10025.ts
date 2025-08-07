// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10025 = {
  name: "AEON Chain",
  shortName: "aeon",
  chain: "AEON Chain",
  icon: "aeon",
  rpc: ["https://node.aeon.xyz/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "AEON Token",
    symbol: "AEON",
    decimals: 18,
  },
  infoURL: "",
  chainId: 10025,
  networkId: 10025,
  explorers: [
    {
      name: "AEON Explorer",
      url: "https://scan.aeon.xyz",
      standard: "none",
    },
  ],
} satisfies Chain
