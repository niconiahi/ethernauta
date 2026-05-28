import type { Chain } from "../shared"

export const eip155_3223 = {
  name: "XO Market",
  shortName: "xo",
  chain: "XO",
  rpc: ["https://rpc-mainnet-2.xo.market/"],
  faucets: [],
  nativeCurrency: {
    name: "XO",
    symbol: "XO",
    decimals: 18,
  },
  infoURL: "https://xo.market",
  chainId: 3223,
  networkId: 3223,
  explorers: [
    {
      name: "XO Market Explorer",
      url: "https://explorer-mainnet.xo.market",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
