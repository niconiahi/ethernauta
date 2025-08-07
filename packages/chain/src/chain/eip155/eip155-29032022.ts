// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_29032022 = {
  name: "Flachain Mainnet",
  shortName: "fla",
  chain: "FLX",
  icon: "flacoin",
  rpc: ["https://flachain.flaexchange.top/"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Flacoin",
    symbol: "FLA",
    decimals: 18,
  },
  infoURL: "https://www.flaexchange.top",
  chainId: 29032022,
  networkId: 29032022,
  explorers: [
    {
      name: "FLXExplorer",
      url: "https://explorer.flaexchange.top",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
