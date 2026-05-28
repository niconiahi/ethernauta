import type { Chain } from "../shared"

export const eip155_173 = {
  name: "ENI Mainnet",
  shortName: "eni",
  chain: "ENI",
  icon: "eni",
  rpc: [
    "https://rpc.eniac.network",
    "https://rpc1.eniac.network",
    "https://rpc2.eniac.network",
    "https://enirpc.com",
    "https://jp.enirpc.com",
    "https://jp.eniacrpc.net",
    "wss://rpc.eniac.network/ws/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EGAS",
    symbol: "EGAS",
    decimals: 18,
  },
  infoURL: "https://eniac.network/",
  chainId: 173,
  networkId: 173,
  explorers: [
    {
      name: "ENI Explorer",
      url: "https://scan.eniac.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
