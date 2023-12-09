/* eslint no-template-curly-in-string: 0 */
export const hbit = {
  name: "HashBit Mainnet",
  shortName: "hbit",
  chain: "HBIT",
  rpc: [
    "https://mainnet-rpc.hashbit.org",
    "https://rpc.hashbit.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "HashBit Native Token",
    symbol: "HBIT",
    decimals: 18,
  },
  infoURL: "https://hashbit.org",
  chainId: 11119,
  networkId: 11119,
  explorers: [
    {
      name: "hashbitscan",
      url: "https://explorer.hashbit.org",
      standard: "EIP3091",
    },
  ],
} as const
