import type { Chain } from "../shared"

export const eip155_373 = {
  name: "Status Network",
  shortName: "snt",
  title: "Status Network Mainnet",
  chain: "ETH",
  icon: "snt",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://status.network",
  chainId: 373,
  networkId: 373,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://bridge.status.network",
      },
    ],
  },
  status: "deprecated",
} satisfies Chain
