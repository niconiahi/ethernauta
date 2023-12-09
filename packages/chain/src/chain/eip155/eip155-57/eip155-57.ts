/* eslint no-template-curly-in-string: 0 */
export const eip155_57 = {
  name: "Syscoin Mainnet",
  shortName: "sys",
  chain: "SYS",
  rpc: [
    "https://rpc.syscoin.org",
    "https://rpc.ankr.com/syscoin/${ANKR_API_KEY}",
    "https://syscoin.public-rpc.com",
    "wss://rpc.syscoin.org/wss",
    "https://syscoin-evm.publicnode.com",
    "wss://syscoin-evm.publicnode.com",
  ],
  faucets: [
    "https://faucet.syscoin.org",
  ],
  nativeCurrency: {
    name: "Syscoin",
    symbol: "SYS",
    decimals: 18,
  },
  infoURL: "https://www.syscoin.org",
  chainId: 57,
  networkId: 57,
  explorers: [
    {
      name: "Syscoin Block Explorer",
      url: "https://explorer.syscoin.org",
      standard: "EIP3091",
    },
  ],
} as const
