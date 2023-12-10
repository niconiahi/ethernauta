import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_381931: Chain = {
  name: "Metal C-Chain",
  shortName: "metal",
  chain: "Metal",
  rpc: [
    "https://api.metalblockchain.org/ext/bc/C/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Metal",
    symbol: "METAL",
    decimals: 18,
  },
  infoURL: "https://www.metalblockchain.org/",
  chainId: 381931,
  networkId: 381931,
  slip44: 9005,
  explorers: [
    {
      name: "metalscan",
      url: "https://metalscan.io",
      standard: "EIP3091",
    },
  ],
}
