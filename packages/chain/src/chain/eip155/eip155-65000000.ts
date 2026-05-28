import type { Chain } from "../shared"

export const eip155_65000000 = {
  name: "Autonity Mainnet",
  shortName: "aut",
  chain: "AUT",
  icon: "autonity",
  rpc: [
    "https://rpc.autonity-apis.com",
    "wss://rpc.autonity-apis.com",
    "https://autonity.rpc.web3cdn.network",
    "wss://autonity.rpc.web3cdn.network",
    "https://autonity.rpc.subquery.network/public",
    "wss://autonity.rpc.subquery.network/public",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Auton",
    symbol: "ATN",
    decimals: 18,
  },
  infoURL: "https://autonity.org/",
  chainId: 65000000,
  networkId: 65000000,
  slip44: 1,
  explorers: [
    {
      name: "autonityscan",
      url: "https://autonityscan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
