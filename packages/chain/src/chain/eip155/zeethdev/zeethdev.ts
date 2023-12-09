/* eslint no-template-curly-in-string: 0 */
export const zeethdev = {
  name: "Zeeth Chain Dev",
  shortName: "zeethdev",
  chain: "ZeethChainDev",
  rpc: [
    "https://rpc.dev.zeeth.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Zeeth Token",
    symbol: "ZTH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 859,
  networkId: 859,
  explorers: [
    {
      name: "Zeeth Explorer Dev",
      url: "https://explorer.dev.zeeth.io",
      standard: "none",
    },
  ],
} as const
