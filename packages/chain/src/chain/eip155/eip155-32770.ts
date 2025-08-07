// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_32770 = {
  name: "Zilliqa 2 EVM proto-mainnet",
  shortName: "zq2-proto-mainnet",
  chain: "ZIL",
  icon: "zilliqa",
  rpc: ["https://api.zq2-protomainnet.zilliqa.com"],
  faucets: ["https://faucet.zq2-protomainnet.zilliqa.com"],
  nativeCurrency: {
    name: "Zilliqa",
    symbol: "ZIL",
    decimals: 18,
  },
  infoURL: "https://www.zilliqa.com/",
  chainId: 32770,
  networkId: 32770,
  explorers: [
    {
      name: "Zilliqa 2 EVM proto-mainnet explorer",
      url: "https://explorer.zq2-protomainnet.zilliqa.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
