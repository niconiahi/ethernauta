import type { Chain } from "../shared"

export const eip155_723 = {
  name: "Bitasset Chain Mainnet",
  shortName: "bac",
  chain: "BAC",
  icon: "bac",
  rpc: ["https://rpc.bitassetchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Bitasset Chain Native Token",
    symbol: "BAC",
    decimals: 18,
  },
  infoURL: "https://bitassetchain.io",
  chainId: 723,
  networkId: 723,
  explorers: [
    {
      name: "bacscan",
      url: "https://bacscan.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
