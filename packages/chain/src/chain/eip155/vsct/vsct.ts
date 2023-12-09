/* eslint no-template-curly-in-string: 0 */
export const vsct = {
  name: "Vention Smart Chain Testnet",
  shortName: "vsct",
  chain: "VSCT",
  icon: "ventionTestnet",
  rpc: [
    "https://node-testnet.vention.network",
  ],
  faucets: [
    "https://faucet.vention.network",
  ],
  nativeCurrency: {
    name: "VNT",
    symbol: "VNT",
    decimals: 18,
  },
  infoURL: "https://testnet.ventionscan.io",
  chainId: 741,
  networkId: 741,
  explorers: [
    {
      name: "ventionscan",
      url: "https://testnet.ventionscan.io",
      standard: "EIP3091",
    },
  ],
} as const
