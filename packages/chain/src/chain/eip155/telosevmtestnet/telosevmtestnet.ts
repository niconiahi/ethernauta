/* eslint no-template-curly-in-string: 0 */
export const telosEvmTestnet = {
  name: "Telos EVM Testnet",
  shortName: "TelosEVMTestnet",
  chain: "TLOS",
  rpc: [
    "https://testnet.telos.net/evm",
  ],
  faucets: [
    "https://app.telos.net/testnet/developers",
  ],
  nativeCurrency: {
    name: "Telos",
    symbol: "TLOS",
    decimals: 18,
  },
  infoURL: "https://telos.net",
  chainId: 41,
  networkId: 41,
  explorers: [
    {
      name: "teloscan",
      url: "https://testnet.teloscan.io",
      standard: "EIP3091",
    },
  ],
} as const
