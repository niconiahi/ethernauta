import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_31337: Chain = {
  name: "GoChain Testnet",
  shortName: "got",
  chain: "GO",
  rpc: [
    "https://testnet-rpc.gochain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GoChain Coin",
    symbol: "GO",
    decimals: 18,
  },
  infoURL: "https://gochain.io",
  chainId: 31337,
  networkId: 31337,
  slip44: 6060,
  explorers: [
    {
      name: "GoChain Testnet Explorer",
      url: "https://testnet-explorer.gochain.io",
      standard: "EIP3091",
    },
  ],
}
