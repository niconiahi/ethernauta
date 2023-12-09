/* eslint no-template-curly-in-string: 0 */
export const eip155_345 = {
  name: "Yooldo Verse Mainnet",
  shortName: "YVM",
  chain: "Yooldo Verse",
  icon: "yooldo_verse",
  rpc: [
    "https://rpc.yooldo-verse.xyz/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "OAS",
    symbol: "OAS",
    decimals: 18,
  },
  infoURL: "https://yooldo.gg/",
  chainId: 345,
  networkId: 345,
  explorers: [
    {
      name: "Yooldo Verse Explorer",
      url: "https://explorer.yooldo-verse.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-248",
  },
} as const
