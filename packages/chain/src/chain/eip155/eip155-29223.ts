// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_29223 = {
  name: "Nexa MetaNet",
  shortName: "nexameta",
  chain: "NEXA",
  icon: "nexameta",
  rpc: ["https://nexa.sh/metanet"],
  faucets: [],
  nativeCurrency: {
    name: "Nexa",
    symbol: "NEXA",
    decimals: 18,
  },
  infoURL: "https://nexa.sh/meta",
  chainId: 29223,
  networkId: 29223,
  slip44: 29223,
  explorers: [
    {
      name: "NexaShell",
      url: "https://nexa.sh",
      standard: "none",
    },
  ],
} satisfies Chain
