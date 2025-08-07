// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42262 = {
  name: "Oasis Emerald",
  shortName: "emerald",
  chain: "Emerald",
  icon: "oasis",
  rpc: [
    "https://emerald.oasis.io",
    "wss://emerald.oasis.io/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Emerald Rose",
    symbol: "ROSE",
    decimals: 18,
  },
  infoURL: "https://docs.oasis.io/dapp/emerald",
  chainId: 42262,
  networkId: 42262,
  explorers: [
    {
      name: "Oasis Emerald Explorer",
      url: "https://explorer.oasis.io/mainnet/emerald",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
