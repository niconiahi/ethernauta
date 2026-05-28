import type { Chain } from "../shared"

export const eip155_4290 = {
  name: "TPIX Chain Testnet",
  shortName: "tpix-testnet",
  chain: "TPIX",
  icon: "tpix",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Thaiprompt Index",
    symbol: "tTPIX",
    decimals: 18,
  },
  infoURL: "https://tpix.online",
  chainId: 4290,
  networkId: 4290,
  explorers: [],
} satisfies Chain
