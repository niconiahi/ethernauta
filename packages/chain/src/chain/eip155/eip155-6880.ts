// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_6880 = {
  name: "MTT Network",
  shortName: "mtt-network",
  chain: "MTT",
  icon: "mttnetwork",
  rpc: ["https://evm-rpc.mtt.network"],
  faucets: [],
  nativeCurrency: {
    name: "MTT Network native coin",
    symbol: "MTT",
    decimals: 18,
  },
  infoURL: "https://mtt.network",
  chainId: 6880,
  networkId: 6880,
  explorers: [
    {
      name: "Mtt explorer",
      url: "https://explorer.mtt.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
