/* eslint no-template-curly-in-string: 0 */
export const imxDevnet = {
  name: "Immutable zkEVM Devnet",
  shortName: "imx-devnet",
  chain: "Immutable zkEVM",
  icon: "immutable",
  rpc: [
    "https://rpc.dev.immutable.com",
  ],
  faucets: [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet",
  ],
  nativeCurrency: {
    name: "Dev IMX",
    symbol: "dIMX",
    decimals: 18,
  },
  infoURL: "https://www.immutable.com",
  chainId: 15003,
  networkId: 15003,
  explorers: [
    {
      name: "Immutable Devnet explorer",
      url: "https://explorer.dev.immutable.com",
      standard: "EIP3091",
    },
  ],
} as const
