import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_355113: Chain = {
  name: "Bitfinity Network Testnet",
  shortName: "Bitfinity",
  chain: "BFT",
  rpc: [
    "https://testnet.bitfinity.network",
  ],
  faucets: [
    "https://bitfinity.network/faucet",
  ],
  nativeCurrency: {
    name: "BITFINITY",
    symbol: "BFT",
    decimals: 18,
  },
  infoURL: "https://bitfinity.network",
  chainId: 355113,
  networkId: 355113,
  explorers: [
    {
      name: "Bitfinity Block Explorer",
      url: "https://explorer.bitfinity.network",
      standard: "EIP3091",
    },
  ],
}
