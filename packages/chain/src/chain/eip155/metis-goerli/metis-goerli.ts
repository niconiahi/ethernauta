/* eslint no-template-curly-in-string: 0 */
export const metisGoerli = {
  name: "Metis Goerli Testnet",
  shortName: "metis-goerli",
  chain: "ETH",
  rpc: [
    "https://goerli.gateway.metisdevops.link",
  ],
  faucets: [
    "https://goerli.faucet.metisdevops.link",
  ],
  nativeCurrency: {
    name: "Goerli Metis",
    symbol: "METIS",
    decimals: 18,
  },
  infoURL: "https://www.metis.io",
  chainId: 599,
  networkId: 599,
  explorers: [
    {
      name: "blockscout",
      url: "https://goerli.explorer.metisdevops.link",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-4",
    bridges: [
      {
        url: "https://testnet-bridge.metis.io",
      },
    ],
  },
} as const
