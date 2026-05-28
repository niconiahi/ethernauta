import type { Chain } from "../shared"

export const eip155_8472 = {
  name: "MyRx Network",
  shortName: "mrt",
  chain: "MRT",
  rpc: [
    "https://rpc.myrxwallet.io",
    "wss://rpc.myrxwallet.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MyRx Token",
    symbol: "MRT",
    decimals: 18,
  },
  infoURL: "https://myrxwallet.io",
  chainId: 8472,
  networkId: 8472,
  explorers: [
    {
      name: "MyRx Explorer",
      url: "https://explorer.myrxwallet.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
