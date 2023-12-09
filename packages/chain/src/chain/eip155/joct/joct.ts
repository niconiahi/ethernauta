/* eslint no-template-curly-in-string: 0 */
export const joct = {
  name: "Japan Open Chain Testnet",
  shortName: "joct",
  chain: "JOCT",
  rpc: [
    "https://rpc-1.testnet.japanopenchain.org:8545",
    "https://rpc-2.testnet.japanopenchain.org:8545",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Japan Open Chain Testnet Token",
    symbol: "JOCT",
    decimals: 18,
  },
  infoURL: "https://www.japanopenchain.org/",
  chainId: 10081,
  networkId: 10081,
  explorers: [
    {
      name: "Testnet Block Explorer",
      url: "https://explorer.testnet.japanopenchain.org",
      standard: "EIP3091",
    },
  ],
} as const