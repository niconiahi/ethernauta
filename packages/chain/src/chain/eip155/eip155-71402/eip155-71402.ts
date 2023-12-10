import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_71402: Chain = {
  name: "Godwoken Mainnet",
  shortName: "gw-mainnet-v1",
  chain: "GWT",
  rpc: [
    "https://v1.mainnet.godwoken.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "pCKB",
    symbol: "pCKB",
    decimals: 18,
  },
  infoURL: "https://www.nervos.org",
  chainId: 71402,
  networkId: 71402,
  explorers: [
    {
      name: "GWScan Block Explorer",
      url: "https://v1.gwscan.com",
      standard: "none",
    },
  ],
}
