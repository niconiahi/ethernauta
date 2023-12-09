/* eslint no-template-curly-in-string: 0 */
export const tKek = {
  name: "Kekchain (kektest)",
  shortName: "tKEK",
  chain: "kek",
  icon: "kek",
  rpc: [
    "https://testnet.kekchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "tKEK",
    symbol: "tKEK",
    decimals: 18,
  },
  infoURL: "https://kekchain.com",
  chainId: 420666,
  networkId: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet-explorer.kekchain.com",
      standard: "EIP3091",
    },
  ],
} as const