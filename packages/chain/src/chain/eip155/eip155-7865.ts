// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7865 = {
  name: "Powerloom Mainnet",
  shortName: "power",
  chain: "POWER",
  icon: "power",
  rpc: ["https://rpc.powerloom.network"],
  faucets: [],
  nativeCurrency: {
    name: "Powerloom Token",
    symbol: "POWER",
    decimals: 18,
  },
  infoURL: "https://powerloom.network",
  chainId: 7865,
  networkId: 7865,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.powerloom.network",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
