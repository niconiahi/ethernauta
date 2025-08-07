// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42001 = {
  name: "PMON Chain",
  shortName: "pmon",
  chain: "42001",
  icon: "pmon",
  rpc: ["https://rpc.pmon.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "PMON Token",
    symbol: "PMON",
    decimals: 18,
  },
  infoURL: "https://protocolmonsterlabs.com/pmon-chain",
  chainId: 42001,
  networkId: 42001,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.pmon.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-42161",
    bridges: [
      {
        url: "https://bridge.arbitrum.io",
      },
    ],
  },
} satisfies Chain
