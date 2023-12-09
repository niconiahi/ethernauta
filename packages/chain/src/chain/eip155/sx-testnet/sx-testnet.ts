/* eslint no-template-curly-in-string: 0 */
export const sxTestnet = {
  name: "SX Network Testnet",
  shortName: "SX-Testnet",
  chain: "SX",
  icon: "SX",
  rpc: [
    "https://rpc.toronto.sx.technology",
  ],
  faucets: [
    "https://faucet.toronto.sx.technology",
  ],
  nativeCurrency: {
    name: "SX Network",
    symbol: "SX",
    decimals: 18,
  },
  infoURL: "https://www.sx.technology",
  chainId: 647,
  networkId: 647,
  explorers: [
    {
      name: "SX Network Toronto Explorer",
      url: "https://explorer.toronto.sx.technology",
      standard: "EIP3091",
    },
  ],
} as const
