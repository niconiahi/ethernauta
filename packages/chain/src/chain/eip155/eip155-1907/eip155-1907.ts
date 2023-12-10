import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1907: Chain = {
  name: "Bitcichain Mainnet",
  shortName: "bitci",
  chain: "BITCI",
  icon: "bitci",
  rpc: [
    "https://rpc.bitci.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Bitci",
    symbol: "BITCI",
    decimals: 18,
  },
  infoURL: "https://www.bitcichain.com",
  chainId: 1907,
  networkId: 1907,
  explorers: [
    {
      name: "Bitci Explorer",
      url: "https://bitciexplorer.com",
      standard: "EIP3091",
    },
  ],
}
