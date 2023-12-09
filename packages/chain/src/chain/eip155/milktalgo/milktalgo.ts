/* eslint no-template-curly-in-string: 0 */
export const milkTalgo = {
  name: "Milkomeda A1 Testnet",
  shortName: "milkTAlgo",
  chain: "milkTAlgo",
  icon: "milkomeda",
  rpc: [
    "https://rpc-devnet-algorand-rollup.a1.milkomeda.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "milkTAlgo",
    symbol: "mTAlgo",
    decimals: 18,
  },
  infoURL: "https://milkomeda.com",
  chainId: 200202,
  networkId: 200202,
  explorers: [
    {
      name: "Blockscout",
      url: "https://explorer-devnet-algorand-rollup.a1.milkomeda.com",
      standard: "none",
    },
  ],
} as const
