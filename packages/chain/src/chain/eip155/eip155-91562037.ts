import type { Chain } from "../shared"

export const eip155_91562037 = {
  name: "MST Testnet",
  shortName: "mst-testnet",
  chain: "MST",
  icon: "mst",
  rpc: [
    "https://testnetrpc.mstblockchain.com",
    "wss://testnetrpc.mstblockchain.com",
  ],
  faucets: ["https://faucet.mstblockchain.com"],
  nativeCurrency: {
    name: "MST Native Coin",
    symbol: "tMSTC",
    decimals: 18,
  },
  infoURL: "https://mstblockchain.com",
  chainId: 91562037,
  networkId: 91562037,
  explorers: [
    {
      name: "mstscan",
      url: "https://testnet.mstscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
