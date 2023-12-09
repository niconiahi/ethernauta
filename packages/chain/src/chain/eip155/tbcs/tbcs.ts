/* eslint no-template-curly-in-string: 0 */
export const tbcs = {
  name: "BlockChain Station Testnet",
  shortName: "tbcs",
  chain: "BCS",
  rpc: [
    "https://rpc-testnet.bcsdev.io",
    "wss://rpc-ws-testnet.bcsdev.io",
  ],
  faucets: [
    "https://faucet.bcsdev.io",
  ],
  nativeCurrency: {
    name: "BCS Testnet Token",
    symbol: "tBCS",
    decimals: 18,
  },
  infoURL: "https://blockchainstation.io",
  chainId: 708,
  networkId: 708,
  explorers: [
    {
      name: "BlockChain Station Explorer",
      url: "https://testnet.bcsdev.io",
      standard: "EIP3091",
    },
  ],
} as const
