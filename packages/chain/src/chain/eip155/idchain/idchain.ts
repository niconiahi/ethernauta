/* eslint no-template-curly-in-string: 0 */
export const idchain = {
  name: "IDChain Mainnet",
  shortName: "idchain",
  chain: "IDChain",
  icon: "idchain",
  rpc: [
    "https://idchain.one/rpc/",
    "wss://idchain.one/ws/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EIDI",
    symbol: "EIDI",
    decimals: 18,
  },
  infoURL: "https://idchain.one/begin/",
  chainId: 74,
  networkId: 74,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer.idchain.one",
      standard: "EIP3091",
    },
  ],
} as const
