import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1969: Chain = {
  name: "Super Smart Chain Testnet",
  shortName: "tscs",
  chain: "TSCS",
  icon: "super",
  rpc: [
    "https://testnetrpc.scschain.com",
  ],
  faucets: [
    "https://testnet.scschain.com",
  ],
  nativeCurrency: {
    name: "Super Chain Native Token",
    symbol: "TSCS",
    decimals: 18,
  },
  infoURL: "https://testnet.scschain.com",
  chainId: 1969,
  networkId: 1969,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnetscan.scschain.com",
      standard: "EIP3091",
    },
  ],
}
