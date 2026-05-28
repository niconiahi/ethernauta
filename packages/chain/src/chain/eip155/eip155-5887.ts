import type { Chain } from "../shared"

export const eip155_5887 = {
  name: "MANTRACHAIN Testnet",
  shortName: "dukong",
  chain: "Dukong",
  icon: "mantra",
  rpc: [
    "https://evm.dukong.mantrachain.io",
    "wss://evm.dukong.mantrachain.io/ws",
  ],
  faucets: ["https://faucet.dukong.mantrachain.io"],
  nativeCurrency: {
    name: "MANTRA",
    symbol: "MANTRA",
    decimals: 18,
  },
  infoURL: "https://mantrachain.io",
  chainId: 5887,
  networkId: 5887,
  slip44: 1,
  explorers: [
    {
      name: "Dukong Explorer",
      url: "http://mantrascan.io/dukong",
      standard: "none",
    },
  ],
} satisfies Chain
