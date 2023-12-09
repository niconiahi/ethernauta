/* eslint no-template-curly-in-string: 0 */
export const eip155_8194 = {
  name: "Torus Testnet",
  shortName: "ttqf",
  chain: "TQF",
  icon: "torus",
  rpc: [
    "https://rpc.testnet.toruschain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "tTQF",
    symbol: "TTQF",
    decimals: 18,
  },
  infoURL: "https://docs.toruschain.com",
  chainId: 8194,
  networkId: 8194,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.toruscan.com",
      standard: "EIP3091",
    },
  ],
} as const
