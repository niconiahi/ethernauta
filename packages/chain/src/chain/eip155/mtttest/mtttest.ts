/* eslint no-template-curly-in-string: 0 */
export const mtttest = {
  name: "MetaDot Testnet",
  shortName: "mtttest",
  chain: "MTTTest",
  rpc: [
    "https://testnet.metadot.network",
  ],
  faucets: [
    "https://faucet.metadot.network/",
  ],
  nativeCurrency: {
    name: "MetaDot Token TestNet",
    symbol: "MTTest",
    decimals: 18,
  },
  infoURL: "https://metadot.network",
  chainId: 16001,
  networkId: 16001,
} as const