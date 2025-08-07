// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_168169 = {
  name: "MUD Chain",
  shortName: "MUD",
  chain: "MUD",
  icon: "mud",
  rpc: ["https://rpc.mud.network"],
  faucets: ["https://faucet.mud.network"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "MUD",
    symbol: "MUD",
    decimals: 18,
  },
  infoURL: "https://mud.network",
  chainId: 168169,
  networkId: 168169,
  explorers: [
    {
      name: "MUD Chain Scan",
      url: "https://scan.mud.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
