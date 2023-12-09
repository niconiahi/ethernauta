/* eslint no-template-curly-in-string: 0 */
export const liquichain = {
  name: "Liquichain",
  shortName: "Liquichain",
  chain: "LQC",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Licoin",
    symbol: "LCN",
    decimals: 18,
  },
  infoURL: "https://liquichain.io/",
  chainId: 1662,
  networkId: 1662,
  explorers: [
    {
      name: "Liquichain Mainnet",
      url: "https://mainnet.liquichain.io",
      standard: "EIP3091",
    },
  ],
  redFlags: [
    "reusedChainId",
  ],
} as const
