import type { Chain } from "../shared"

export const eip155_33101 = {
  name: "Zilliqa 2 Testnet",
  shortName: "zil-testnet",
  chain: "ZIL",
  rpc: ["https://api.testnet.zilliqa.com"],
  faucets: ["https://faucet.testnet.zilliqa.com"],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
  infoURL: "https://www.zilliqa.com",
  chainId: 33101,
  networkId: 33101,
  slip44: 1,
  explorers: [
    {
      name: "Zilliqa 2 Testnet Explorer",
      url: "https://testnet.zilliqa.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
