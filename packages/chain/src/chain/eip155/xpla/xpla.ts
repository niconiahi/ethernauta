/* eslint no-template-curly-in-string: 0 */
export const xpla = {
  name: "Xpla Mainnet",
  shortName: "xpla",
  chain: "XPLA",
  icon: "xpla",
  rpc: [
    "https://dimension-evm-rpc.xpla.dev",
  ],
  faucets: [],
  nativeCurrency: {
    name: "XPLA",
    symbol: "XPLA",
    decimals: 18,
  },
  infoURL: "https://xpla.io",
  chainId: 37,
  networkId: 37,
  explorers: [
    {
      name: "XPLA Explorer",
      url: "https://explorer.xpla.io/mainnet",
      standard: "EIP3091",
    },
  ],
  redFlags: [
    "reusedChainId",
  ],
} as const
