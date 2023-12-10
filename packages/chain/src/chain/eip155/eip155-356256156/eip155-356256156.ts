import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_356256156: Chain = {
  name: "Gather Testnet Network",
  shortName: "tGTH",
  chain: "GTH",
  icon: "gather",
  rpc: [
    "https://testnet.gather.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Gather",
    symbol: "GTH",
    decimals: 18,
  },
  infoURL: "https://gather.network",
  chainId: 356256156,
  networkId: 356256156,
  explorers: [
    {
      name: "Blockscout",
      url: "https://testnet-explorer.gather.network",
      standard: "none",
    },
  ],
}
