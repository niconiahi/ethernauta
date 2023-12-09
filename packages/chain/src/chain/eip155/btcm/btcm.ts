/* eslint no-template-curly-in-string: 0 */
export const btCm = {
  name: "Botanix Mainnet",
  shortName: "BTCm",
  chain: "BTC",
  icon: "botanix",
  rpc: [
    "https://rpc.btxtestchain.com",
  ],
  faucets: [
    "https://faucet.btxtestchain.com",
  ],
  nativeCurrency: {
    name: "Botanix",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://btxtestchain.com",
  chainId: 3637,
  networkId: 3637,
  explorers: [
    {
      name: "Botanix",
      url: "https://btxtestchain.com",
      standard: "EIP3091",
    },
  ],
} as const
