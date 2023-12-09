/* eslint no-template-curly-in-string: 0 */
export const eip155_100010 = {
  name: "VeChain Testnet",
  shortName: "vechain-testnet",
  chain: "VeChain",
  rpc: [],
  faucets: [
    "https://faucet.vecha.in",
  ],
  nativeCurrency: {
    name: "VeChain",
    symbol: "VET",
    decimals: 18,
  },
  infoURL: "https://vechain.org",
  chainId: 100010,
  networkId: 100010,
  explorers: [
    {
      name: "VeChain Explorer",
      url: "https://explore-testnet.vechain.org",
      standard: "none",
    },
  ],
} as const
