/* eslint no-template-curly-in-string: 0 */
export const celo = {
  name: "Celo Mainnet",
  shortName: "celo",
  chain: "CELO",
  rpc: [
    "https://forno.celo.org",
    "wss://forno.celo.org/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  infoURL: "https://docs.celo.org/",
  chainId: 42220,
  networkId: 42220,
  explorers: [
    {
      name: "Celoscan",
      url: "https://celoscan.io",
      standard: "EIP3091",
    },
    {
      name: "blockscout",
      url: "https://explorer.celo.org",
      standard: "none",
    },
  ],
} as const
