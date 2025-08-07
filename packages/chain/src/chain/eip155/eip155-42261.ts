// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_42261 = {
  name: "Oasis Emerald Testnet",
  shortName: "emerald-testnet",
  chain: "Emerald",
  icon: "oasis",
  rpc: [
    "https://testnet.emerald.oasis.io/",
    "wss://testnet.emerald.oasis.io/ws",
  ],
  faucets: ["https://faucet.testnet.oasis.io/"],
  nativeCurrency: {
    name: "Emerald Test Rose",
    symbol: "TEST",
    decimals: 18,
  },
  infoURL: "https://docs.oasis.io/dapp/emerald",
  chainId: 42261,
  networkId: 42261,
  slip44: 1,
  explorers: [
    {
      name: "Oasis Emerald Testnet Explorer",
      url: "https://explorer.oasis.io/testnet/emerald",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
