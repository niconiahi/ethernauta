/* eslint no-template-curly-in-string: 0 */
export const manta = {
  name: "Manta Pacific Mainnet",
  shortName: "manta",
  chain: "Manta Pacific",
  icon: "manta",
  rpc: [
    "https://pacific-rpc.manta.network/http",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://pacific-info.manta.network",
  chainId: 169,
  networkId: 169,
  explorers: [
    {
      name: "manta-pacific Explorer",
      url: "https://pacific-explorer.manta.network",
      standard: "EIP3091",
    },
  ],
} as const
