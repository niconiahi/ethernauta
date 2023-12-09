/* eslint no-template-curly-in-string: 0 */
export const obe = {
  name: "OEBlock Testnet",
  shortName: "obe",
  chain: "OEBt",
  icon: "oescan",
  rpc: [
    "https://testnet-rpc.oeblock.com",
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
    name: "OEBlock",
    symbol: "OEB",
    decimals: 18,
  },
  infoURL: "https://www.oeblock.com/",
  chainId: 156,
  networkId: 156,
  explorers: [
    {
      name: "OEScan explorer",
      url: "https://testnet.oescan.io",
      standard: "EIP3091",
    },
  ],
} as const
