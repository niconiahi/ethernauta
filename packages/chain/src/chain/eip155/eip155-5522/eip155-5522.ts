/* eslint no-template-curly-in-string: 0 */
export const eip155_5522 = {
  name: "VEX EVM TESTNET",
  shortName: "VEX",
  chain: "vex",
  icon: "vex",
  rpc: [
    "https://testnet.vexascan.com/evmapi",
  ],
  faucets: [
    "https://t.me/vexfaucetbot",
  ],
  nativeCurrency: {
    name: "VEX EVM TESTNET",
    symbol: "VEX",
    decimals: 18,
  },
  infoURL: "https://vexanium.com",
  chainId: 5522,
  networkId: 5522,
  explorers: [
    {
      name: "Vexascan-EVM-TestNet",
      url: "https://testnet.vexascan.com/evmexplorer",
      standard: "EIP3091",
    },
  ],
} as const
