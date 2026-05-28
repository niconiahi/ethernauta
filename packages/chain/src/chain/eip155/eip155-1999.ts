import type { Chain } from "../shared"

export const eip155_1999 = {
  name: "STO Chain Testnet",
  shortName: "tstoc",
  chain: "TSTOC",
  icon: "stoc",
  rpc: ["https://evm-stoc-testnet.stochainscan.io"],
  faucets: [
    "https://testnet.stochainscan.io/en/request-faucet",
  ],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "TSTOC",
    symbol: "TSTOC",
    decimals: 18,
  },
  infoURL: "https://www.stochain.io/",
  chainId: 1999,
  networkId: 1999,
  explorers: [
    {
      name: "STO Chain Testnet Explorer",
      url: "https://testnet.stochainscan.io/en",
      standard: "none",
    },
  ],
  status: "active",
} satisfies Chain
