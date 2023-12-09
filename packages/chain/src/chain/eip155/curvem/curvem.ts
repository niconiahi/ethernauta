/* eslint no-template-curly-in-string: 0 */
export const curvEm = {
  name: "CURVE Mainnet",
  shortName: "CURVEm",
  chain: "CURVE",
  icon: "curveIcon",
  rpc: [
    "https://mainnet-rpc.curvescan.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Curve",
    symbol: "CURVE",
    decimals: 18,
  },
  infoURL: "https://curvescan.io",
  chainId: 827431,
  networkId: 827431,
  explorers: [
    {
      name: "CURVE Mainnet",
      url: "https://curvescan.io",
      standard: "EIP3091",
    },
  ],
} as const
