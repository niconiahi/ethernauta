import type { Chain } from "../shared"

export const eip155_174 = {
  name: "ENI Testnet",
  shortName: "eni-test",
  chain: "ENI",
  icon: "eni-test",
  rpc: ["https://rpc-testnet.eniac.network"],
  faucets: [],
  nativeCurrency: {
    name: "EGAS",
    symbol: "EGAS",
    decimals: 18,
  },
  infoURL: "https://eniac.network/",
  chainId: 174,
  networkId: 174,
  explorers: [
    {
      name: "ENI Testnet Explorer",
      url: "https://scan-testnet.eniac.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
