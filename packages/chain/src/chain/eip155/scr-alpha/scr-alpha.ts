/* eslint no-template-curly-in-string: 0 */
export const scrAlpha = {
  name: "Scroll Alpha Testnet",
  shortName: "scr-alpha",
  chain: "ETH",
  rpc: [
    "https://alpha-rpc.scroll.io/l2",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://scroll.io",
  chainId: 534353,
  networkId: 534353,
  explorers: [
    {
      name: "Scroll Alpha Testnet Block Explorer",
      url: "https://alpha-blockscout.scroll.io",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-5",
    bridges: [],
  },
  status: "deprecated",
} as const
