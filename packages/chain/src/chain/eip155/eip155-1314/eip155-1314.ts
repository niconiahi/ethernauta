import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1314: Chain = {
  name: "Alyx Mainnet",
  shortName: "alyx",
  chain: "ALYX",
  icon: "alyx",
  rpc: [
    "https://rpc.alyxchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Alyx Chain Native Token",
    symbol: "ALYX",
    decimals: 18,
  },
  infoURL: "https://www.alyxchain.com",
  chainId: 1314,
  networkId: 1314,
  explorers: [
    {
      name: "alyxscan",
      url: "https://www.alyxscan.com",
      standard: "EIP3091",
    },
  ],
}
