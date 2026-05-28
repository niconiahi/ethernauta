import type { Chain } from "../shared"

export const eip155_13863860 = {
  name: "Symbiosis",
  shortName: "symbiosis",
  chain: "symbiosis",
  rpc: ["https://symbiosis.calderachain.xyz/http"],
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
    name: "Symbiosis",
    symbol: "SIS",
    decimals: 18,
  },
  infoURL: "https://symbiosis.hub.caldera.xyz",
  chainId: 13863860,
  networkId: 13863860,
  explorers: [
    {
      name: "Symbiosis Caldera Explorer",
      url: "https://symbiosis.calderaexplorer.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
