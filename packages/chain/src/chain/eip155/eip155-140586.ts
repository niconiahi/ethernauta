import type { Chain } from "../shared"

export const eip155_140586 = {
  name: "BEXChain",
  shortName: "bexchain",
  chain: "BEX",
  icon: "bexchain",
  rpc: ["https://rpc.bexchain.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BEX",
    symbol: "BEX",
    decimals: 18,
  },
  infoURL: "https://bexchain.com",
  chainId: 140586,
  networkId: 140586,
  slip44: 60,
  explorers: [
    {
      name: "BEXChain Scan",
      url: "https://scan.bexchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
