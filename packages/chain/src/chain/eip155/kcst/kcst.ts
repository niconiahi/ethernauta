/* eslint no-template-curly-in-string: 0 */
export const kcst = {
  name: "KCC Testnet",
  shortName: "kcst",
  chain: "KCC",
  rpc: [
    "https://rpc-testnet.kcc.network",
  ],
  faucets: [
    "https://faucet-testnet.kcc.network",
  ],
  nativeCurrency: {
    name: "KuCoin Testnet Token",
    symbol: "tKCS",
    decimals: 18,
  },
  infoURL: "https://scan-testnet.kcc.network",
  chainId: 322,
  networkId: 322,
  explorers: [
    {
      name: "kcc-scan-testnet",
      url: "https://scan-testnet.kcc.network",
      standard: "EIP3091",
    },
  ],
} as const
