/* eslint no-template-curly-in-string: 0 */
export const olo = {
  name: "TOOL Global Mainnet",
  shortName: "olo",
  chain: "OLO",
  rpc: [
    "https://mainnet-web3.wolot.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "TOOL Global",
    symbol: "OLO",
    decimals: 18,
  },
  infoURL: "https://ibdt.io",
  chainId: 8723,
  networkId: 8723,
  slip44: 479,
  explorers: [
    {
      name: "OLO Block Explorer",
      url: "https://www.olo.network",
      standard: "EIP3091",
    },
  ],
} as const
