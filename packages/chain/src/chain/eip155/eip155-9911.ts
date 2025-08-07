// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9911 = {
  name: "Espento Mainnet",
  shortName: "spent",
  chain: "SPENT",
  icon: "espento",
  rpc: ["https://rpc.escscan.com/"],
  faucets: [],
  nativeCurrency: {
    name: "ESPENTO",
    symbol: "SPENT",
    decimals: 18,
  },
  infoURL: "https://espento.network",
  chainId: 9911,
  networkId: 9911,
  explorers: [
    {
      name: "escscan",
      url: "https://escscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
