import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1909: Chain = {
  name: "Merkle Scan",
  shortName: "MRK",
  chain: "MRK",
  icon: "merklescan",
  rpc: [
    "https://marklechain-rpc.merklescan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Merkle",
    symbol: "MRK",
    decimals: 18,
  },
  infoURL: "https://merklescan.com",
  chainId: 1909,
  networkId: 1909,
  explorers: [
    {
      name: "blockscout",
      url: "https://merklescan.com",
      standard: "none",
    },
  ],
}
