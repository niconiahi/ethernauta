/* eslint no-template-curly-in-string: 0 */
export const imxTestnet = {
  name: "Immutable zkEVM Testnet",
  shortName: "imx-testnet",
  chain: "Immutable zkEVM",
  icon: "immutable",
  rpc: [
    "https://rpc.testnet.immutable.com",
  ],
  faucets: [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet",
  ],
  nativeCurrency: {
    name: "Test IMX",
    symbol: "tIMX",
    decimals: 18,
  },
  infoURL: "https://www.immutable.com",
  chainId: 13473,
  networkId: 13473,
  explorers: [
    {
      name: "Immutable Testnet explorer",
      url: "https://explorer.testnet.immutable.com",
      standard: "EIP3091",
    },
  ],
} as const
