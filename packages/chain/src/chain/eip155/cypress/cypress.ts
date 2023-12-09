/* eslint no-template-curly-in-string: 0 */
export const cypress = {
  name: "Klaytn Mainnet Cypress",
  shortName: "Cypress",
  chain: "KLAY",
  rpc: [
    "https://public-node-api.klaytnapi.com/v1/cypress",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KLAY",
    symbol: "KLAY",
    decimals: 18,
  },
  infoURL: "https://www.klaytn.com/",
  chainId: 8217,
  networkId: 8217,
  slip44: 8217,
  explorers: [
    {
      name: "Klaytnscope",
      url: "https://scope.klaytn.com",
      standard: "none",
    },
  ],
} as const
