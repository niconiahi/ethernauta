import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1970: Chain = {
  name: "Super Smart Chain Mainnet",
  shortName: "scs",
  chain: "SCS",
  icon: "super",
  rpc: [
    "https://rpc.scschain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Super Chain Native Token",
    symbol: "SCS",
    decimals: 18,
  },
  infoURL: "https://scschain.com",
  chainId: 1970,
  networkId: 1970,
  explorers: [
    {
      name: "blockscout",
      url: "https://scan.scschain.com",
      standard: "EIP3091",
    },
  ],
}
