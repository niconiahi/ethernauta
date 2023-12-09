/* eslint no-template-curly-in-string: 0 */
export const tDsc = {
  name: "Decimal Smart Chain Testnet",
  shortName: "tDSC",
  chain: "tDSC",
  icon: "dsc",
  rpc: [
    "https://testnet-val.decimalchain.com/web3/",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Decimal",
    symbol: "tDEL",
    decimals: 18,
  },
  infoURL: "https://decimalchain.com",
  chainId: 202020,
  networkId: 202020,
  explorers: [
    {
      name: "DSC Explorer Testnet",
      url: "https://testnet.explorer.decimalchain.com",
      standard: "EIP3091",
    },
  ],
} as const
