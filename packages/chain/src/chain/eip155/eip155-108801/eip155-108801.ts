import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_108801: Chain = {
  name: "BROChain Mainnet",
  shortName: "bro",
  chain: "BRO",
  rpc: [
    "https://rpc.brochain.org",
    "http://rpc.brochain.org",
    "https://rpc.brochain.org/mainnet",
    "http://rpc.brochain.org/mainnet",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Brother",
    symbol: "BRO",
    decimals: 18,
  },
  infoURL: "https://brochain.org",
  chainId: 108801,
  networkId: 108801,
  explorers: [
    {
      name: "BROChain Explorer",
      url: "https://explorer.brochain.org",
      standard: "EIP3091",
    },
  ],
}
