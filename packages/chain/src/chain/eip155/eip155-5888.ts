import type { Chain } from "../shared"

export const eip155_5888 = {
  name: "MANTRACHAIN Mainnet",
  shortName: "mantrachain",
  chain: "MANTRACHAIN",
  icon: "om",
  rpc: [
    "https://evm.mantrachain.io",
    "wss://evm.mantrachain.io/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OM",
    symbol: "OM",
    decimals: 18,
  },
  infoURL: "https://mantrachain.io",
  chainId: 5888,
  networkId: 5888,
  slip44: 1,
  explorers: [
    {
      name: "MANTRACHAIN Explorer",
      url: "http://mantrascan.io",
      standard: "none",
    },
  ],
} satisfies Chain
