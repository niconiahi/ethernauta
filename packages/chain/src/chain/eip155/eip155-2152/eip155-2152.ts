import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2152: Chain = {
  name: "Findora Mainnet",
  shortName: "fra",
  chain: "Findora",
  rpc: [
    "https://rpc-mainnet.findora.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "FRA",
    symbol: "FRA",
    decimals: 18,
  },
  infoURL: "https://findora.org/",
  chainId: 2152,
  networkId: 2152,
  explorers: [
    {
      name: "findorascan",
      url: "https://evm.findorascan.io",
      standard: "EIP3091",
    },
  ],
}
