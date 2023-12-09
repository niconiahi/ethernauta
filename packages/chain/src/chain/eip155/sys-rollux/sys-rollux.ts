/* eslint no-template-curly-in-string: 0 */
export const sysRollux = {
  name: "Rollux Mainnet",
  shortName: "sys-rollux",
  chain: "SYS",
  rpc: [
    "https://rpc.rollux.com",
    "wss://rpc.rollux.com/wss",
  ],
  faucets: [
    "https://rollux.id/faucetapp",
  ],
  nativeCurrency: {
    name: "Syscoin",
    symbol: "SYS",
    decimals: 18,
  },
  infoURL: "https://rollux.com",
  chainId: 570,
  networkId: 570,
  explorers: [
    {
      name: "Rollux Explorer",
      url: "https://explorer.rollux.com",
      standard: "EIP3091",
    },
  ],
} as const