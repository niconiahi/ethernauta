import type { Chain } from "../shared"

export const eip155_16601 = {
  name: "0G-Galileo-Testnet",
  shortName: "0gai-galileo-testnet",
  chain: "0G-Testnet",
  icon: "0gai",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "A0GI",
    symbol: "A0GI",
    decimals: 18,
  },
  infoURL: "https://0g.ai",
  chainId: 16601,
  networkId: 16601,
  explorers: [],
  status: "deprecated",
} satisfies Chain
