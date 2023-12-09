/* eslint no-template-curly-in-string: 0 */
export const math = {
  name: "MathChain",
  shortName: "MATH",
  chain: "MATH",
  rpc: [
    "https://mathchain-asia.maiziqianbao.net/rpc",
    "https://mathchain-us.maiziqianbao.net/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "MathChain",
    symbol: "MATH",
    decimals: 18,
  },
  infoURL: "https://mathchain.org",
  chainId: 1139,
  networkId: 1139,
} as const