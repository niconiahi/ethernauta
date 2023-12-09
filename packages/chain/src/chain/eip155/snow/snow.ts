/* eslint no-template-curly-in-string: 0 */
export const snow = {
  name: "Numbers Testnet",
  shortName: "Snow",
  chain: "NUM",
  icon: "num",
  rpc: [
    "https://testnetrpc.num.network",
  ],
  faucets: [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network",
  ],
  nativeCurrency: {
    name: "NUM Token",
    symbol: "NUM",
    decimals: 18,
  },
  infoURL: "https://numbersprotocol.io",
  chainId: 10508,
  networkId: 10508,
  explorers: [
    {
      name: "ethernal",
      url: "https://testnet.num.network",
      standard: "EIP3091",
    },
  ],
} as const
