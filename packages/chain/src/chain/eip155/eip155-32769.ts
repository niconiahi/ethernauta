import type { Chain } from "../shared"

export const eip155_32769 = {
  name: "Zilliqa 2",
  shortName: "zil",
  chain: "ZIL",
  icon: "zilliqa",
  rpc: ["https://api.zilliqa.com"],
  faucets: [],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
  infoURL: "https://www.zilliqa.com/",
  chainId: 32769,
  networkId: 32769,
  explorers: [
    {
      name: "Zilliqa 2 Mainnet Explorer",
      url: "https://zilliqa.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
