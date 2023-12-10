import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_814: Chain = {
  name: "Firechain zkEVM",
  shortName: "firechan-zkEVM",
  title: "Firechain zkEVM",
  chain: "Firechain",
  icon: "firechain",
  rpc: [
    "https://rpc.zkevm.thefirechain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.thefirechain.com/",
  chainId: 814,
  networkId: 814,
  explorers: [],
  parent: {
    type: "L2",
    chain: "eip155-1",
    bridges: [
      {
        url: "https://zkevm.bridge.rpc.thefirechain.com",
      },
    ],
  },
}
