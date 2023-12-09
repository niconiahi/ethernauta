/* eslint no-template-curly-in-string: 0 */
export const bnIm = {
  name: "Bitindi Mainnet",
  shortName: "BNIm",
  chain: "BNI",
  icon: "bitindi",
  rpc: [
    "https://mainnet-rpc.bitindi.org",
  ],
  faucets: [
    "https://faucet.bitindi.org",
  ],
  nativeCurrency: {
    name: "BNI",
    symbol: "$BNI",
    decimals: 18,
  },
  infoURL: "https://bitindi.org",
  chainId: 4099,
  networkId: 4099,
  explorers: [
    {
      name: "Bitindi",
      url: "https://bitindiscan.com",
      standard: "EIP3091",
    },
  ],
} as const
