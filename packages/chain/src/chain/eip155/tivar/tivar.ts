/* eslint no-template-curly-in-string: 0 */
export const tivar = {
  name: "IVAR Chain Testnet",
  shortName: "tivar",
  chain: "IVAR",
  icon: "ivar",
  rpc: [
    "https://testnet-rpc.ivarex.com",
  ],
  faucets: [
    "https://tfaucet.ivarex.com/",
  ],
  nativeCurrency: {
    name: "tIvar",
    symbol: "tIVAR",
    decimals: 18,
  },
  infoURL: "https://ivarex.com",
  chainId: 16888,
  networkId: 16888,
  explorers: [
    {
      name: "ivarscan",
      url: "https://testnet.ivarscan.com",
      standard: "EIP3091",
    },
  ],
} as const
