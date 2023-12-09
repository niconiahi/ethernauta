/* eslint no-template-curly-in-string: 0 */
export const eip155_333888 = {
  name: "Polis Testnet",
  shortName: "sparta",
  chain: "Sparta",
  icon: "polis",
  rpc: [
    "https://sparta-rpc.polis.tech",
  ],
  faucets: [
    "https://faucet.polis.tech",
  ],
  nativeCurrency: {
    name: "tPolis",
    symbol: "tPOLIS",
    decimals: 18,
  },
  infoURL: "https://polis.tech",
  chainId: 333888,
  networkId: 333888,
} as const
