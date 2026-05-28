import type { Chain } from "../shared"

export const eip155_1612 = {
  name: "OpenLedger Mainnet",
  shortName: "open",
  chain: "OpenLedger",
  icon: "openledger",
  rpc: ["https://rpc.openledger.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Open",
    symbol: "OPEN",
    decimals: 18,
  },
  infoURL: "https://www.openledger.xyz",
  chainId: 1612,
  networkId: 1612,
  explorers: [
    {
      name: "OpenLedger Explorer",
      url: "https://scan.openledger.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.openledger.xyz/",
      },
    ],
  },
} satisfies Chain
