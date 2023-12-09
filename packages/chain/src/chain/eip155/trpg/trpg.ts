/* eslint no-template-curly-in-string: 0 */
export const trpg = {
  name: "Rangers Protocol Testnet Robin",
  shortName: "trpg",
  chain: "Rangers",
  icon: "rangers",
  rpc: [
    "https://robin.rangersprotocol.com/api/jsonrpc",
  ],
  faucets: [
    "https://robin-faucet.rangersprotocol.com",
  ],
  nativeCurrency: {
    name: "Rangers Protocol Gas",
    symbol: "tRPG",
    decimals: 18,
  },
  infoURL: "https://rangersprotocol.com",
  chainId: 9527,
  networkId: 9527,
  explorers: [
    {
      name: "rangersscan-robin",
      url: "https://robin-rangersscan.rangersprotocol.com",
      standard: "none",
    },
  ],
} as const