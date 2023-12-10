import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_8007736: Chain = {
  name: "Plian Mainnet Subchain 1",
  shortName: "plian-mainnet-l2",
  chain: "Plian",
  rpc: [
    "https://mainnet.plian.io/child_0",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Plian Token",
    symbol: "PI",
    decimals: 18,
  },
  infoURL: "https://plian.org",
  chainId: 8007736,
  networkId: 8007736,
  explorers: [
    {
      name: "piscan",
      url: "https://piscan.plian.org/child_0",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-2099156",
  },
}
