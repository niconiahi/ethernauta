import type { Chain } from "../shared"

export const eip155_6912115 = {
  name: "ENI Testnet (Deprecated)",
  shortName: "eni-test-deprecated",
  chain: "ENI",
  icon: "eni-test",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "EGAS",
    symbol: "EGAS",
    decimals: 18,
  },
  infoURL: "",
  chainId: 6912115,
  networkId: 6912115,
  explorers: [],
  status: "deprecated",
} satisfies Chain
