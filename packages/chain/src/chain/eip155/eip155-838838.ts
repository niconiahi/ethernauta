import type { Chain } from "../shared"

export const eip155_838838 = {
  name: "HyperCluster",
  shortName: "HYPEC",
  chain: "HYPEC",
  icon: "hypercluster",
  rpc: ["https://rpc.hypercluster.org"],
  faucets: ["https://faucet.hypercluster.org"],
  nativeCurrency: {
    name: "HyperCluster Token",
    symbol: "HYPEC",
    decimals: 18,
  },
  infoURL: "https://www.hypercluster.org/",
  chainId: 838838,
  networkId: 838838,
  explorers: [
    {
      name: "HyperCluster Explorer",
      url: "https://explorer.hypercluster.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
