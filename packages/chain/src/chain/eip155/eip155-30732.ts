// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_30732 = {
  name: "Movement EVM Testnet",
  shortName: "movetest",
  chain: "MOVE",
  icon: "move",
  rpc: ["https://mevm.testnet.imola.movementlabs.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Move",
    symbol: "MOVE",
    decimals: 18,
  },
  infoURL: "https://movementlabs.xyz",
  chainId: 30732,
  networkId: 30732,
  explorers: [
    {
      name: "mevm explorer",
      url: "https://explorer.testnet.imola.movementlabs.xyz",
      standard: "none",
    },
  ],
  status: "incubating",
} satisfies Chain
