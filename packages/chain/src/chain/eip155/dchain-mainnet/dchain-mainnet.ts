/* eslint no-template-curly-in-string: 0 */
export const dchainMainnet = {
  name: "D-Chain Mainnet",
  shortName: "dchain-mainnet",
  chain: "D-Chain",
  icon: "dchain",
  rpc: [
    "https://mainnet.d-chain.network/ext/bc/2ZiR1Bro5E59siVuwdNuRFzqL95NkvkbzyLBdrsYR9BLSHV7H4/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DOINX",
    symbol: "DOINX",
    decimals: 18,
  },
  infoURL: "",
  chainId: 1951,
  networkId: 1951,
} as const
