import type { Chain } from "../shared"

export const eip155_4646 = {
  name: "MST Mainnet",
  shortName: "mst",
  chain: "MST",
  icon: "mst",
  rpc: [
    "https://mariorpc.mstblockchain.com",
    "https://craftrpc.mstblockchain.com",
    "wss://mariorpc.mstblockchain.com",
    "wss://craftrpc.mstblockchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MST Native Coin",
    symbol: "MSTC",
    decimals: 18,
  },
  infoURL: "https://mstblockchain.com",
  chainId: 4646,
  networkId: 4646,
  slip44: 4646,
  explorers: [
    {
      name: "mstscan",
      url: "https://mstscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
