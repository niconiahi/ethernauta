/* eslint no-template-curly-in-string: 0 */
export const eip155_942 = {
  name: "PulseChain Testnet v3",
  shortName: "t3pls",
  chain: "t3PLS",
  rpc: [
    "https://rpc.v3.testnet.pulsechain.com/",
    "wss://rpc.v3.testnet.pulsechain.com/",
  ],
  faucets: [
    "https://faucet.v3.testnet.pulsechain.com/",
  ],
  nativeCurrency: {
    name: "Test Pulse",
    symbol: "tPLS",
    decimals: 18,
  },
  infoURL: "https://pulsechain.com/",
  chainId: 942,
  networkId: 942,
  status: "deprecated",
} as const
