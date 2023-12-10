import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_980: Chain = {
  name: "TOP Mainnet EVM",
  shortName: "top_evm",
  chain: "TOP",
  icon: "top",
  rpc: [
    "https://ethapi.topnetwork.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.topnetwork.org/",
  chainId: 980,
  networkId: 0,
  explorers: [
    {
      name: "topscan.dev",
      url: "https://www.topscan.io",
      standard: "none",
    },
  ],
}
