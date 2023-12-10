import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_21816: Chain = {
  name: "omChain Mainnet",
  shortName: "omc",
  chain: "OML",
  icon: "omlira",
  rpc: [
    "https://seed.omchain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "omChain",
    symbol: "OMC",
    decimals: 18,
  },
  infoURL: "https://omchain.io",
  chainId: 21816,
  networkId: 21816,
  explorers: [
    {
      name: "omChain Explorer",
      url: "https://explorer.omchain.io",
      standard: "EIP3091",
    },
  ],
}
