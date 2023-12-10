import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_707: Chain = {
  name: "BlockChain Station Mainnet",
  shortName: "bcs",
  chain: "BCS",
  rpc: [
    "https://rpc-mainnet.bcsdev.io",
    "wss://rpc-ws-mainnet.bcsdev.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BCS Token",
    symbol: "BCS",
    decimals: 18,
  },
  infoURL: "https://blockchainstation.io",
  chainId: 707,
  networkId: 707,
  explorers: [
    {
      name: "BlockChain Station Explorer",
      url: "https://explorer.bcsdev.io",
      standard: "EIP3091",
    },
  ],
}
