import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3639: Chain = {
  name: "iChain Network",
  shortName: "ISLAMI",
  chain: "iChain",
  rpc: [
    "https://rpc.ichainscan.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ISLAMICOIN",
    symbol: "ISLAMI",
    decimals: 18,
  },
  infoURL: "https://islamicoin.finance",
  chainId: 3639,
  networkId: 3639,
  explorers: [
    {
      name: "iChainscan",
      url: "https://ichainscan.com",
      standard: "EIP3091",
    },
  ],
}
