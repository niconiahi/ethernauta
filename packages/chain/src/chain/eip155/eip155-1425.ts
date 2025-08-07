// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1425 = {
  name: "ONINO Mainnet",
  shortName: "onino",
  chain: "ONI",
  icon: "onino",
  rpc: ["https://rpc.onino.io"],
  faucets: ["https://faucet.onino.io"],
  nativeCurrency: {
    name: "ONI",
    symbol: "ONI",
    decimals: 18,
  },
  infoURL: "https://onino.io",
  chainId: 1425,
  networkId: 1425,
  explorers: [
    {
      name: "onino",
      url: "https://explorer.onino.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
