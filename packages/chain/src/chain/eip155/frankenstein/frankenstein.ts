/* eslint no-template-curly-in-string: 0 */
export const frankenstein = {
  name: "OneLedger Testnet Frankenstein",
  shortName: "frankenstein",
  chain: "OLT",
  icon: "oneledger",
  rpc: [
    "https://frankenstein-rpc.oneledger.network",
  ],
  faucets: [
    "https://frankenstein-faucet.oneledger.network",
  ],
  nativeCurrency: {
    name: "OLT",
    symbol: "OLT",
    decimals: 18,
  },
  infoURL: "https://oneledger.io",
  chainId: 4216137055,
  networkId: 4216137055,
  explorers: [
    {
      name: "OneLedger Block Explorer",
      url: "https://frankenstein-explorer.oneledger.network",
      standard: "EIP3091",
    },
  ],
} as const
