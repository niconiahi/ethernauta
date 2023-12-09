/* eslint no-template-curly-in-string: 0 */
export const hap = {
  name: "HAPchain",
  shortName: "hap",
  chain: "HAPchain",
  icon: "hap",
  rpc: [
    "https://jsonrpc.hap.land",
  ],
  faucets: [],
  nativeCurrency: {
    name: "HAP",
    symbol: "HAP",
    decimals: 18,
  },
  infoURL: "https://hap.land",
  chainId: 8794598,
  networkId: 8794598,
  explorers: [
    {
      name: "HAP EVM Explorer (Blockscout)",
      url: "https://blockscout.hap.land",
      standard: "none",
    },
  ],
} as const
