/* eslint no-template-curly-in-string: 0 */
export const brb = {
  name: "BerylBit Mainnet",
  shortName: "brb",
  chain: "BRB",
  icon: "berylbit",
  rpc: [
    "https://mainnet.berylbit.io",
  ],
  faucets: [
    "https://t.me/BerylBit",
  ],
  nativeCurrency: {
    name: "BerylBit Chain Native Token",
    symbol: "BRB",
    decimals: 18,
  },
  infoURL: "https://www.beryl-bit.com",
  chainId: 9012,
  networkId: 9012,
  explorers: [
    {
      name: "berylbit-explorer",
      url: "https://explorer.berylbit.io",
      standard: "EIP3091",
    },
  ],
} as const
