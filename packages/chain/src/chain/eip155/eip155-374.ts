import type { Chain } from "../shared"

export const eip155_374 = {
  name: "Status Network Hoodi",
  shortName: "snt-hoodi",
  title: "Status Network Hoodi",
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
  chainId: 374,
  networkId: 374,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-560048",
    bridges: [
      {
        url: "https://bridge.status.network",
      },
    ],
  },
  status: "deprecated",
} satisfies Chain
