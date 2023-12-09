/* eslint no-template-curly-in-string: 0 */
export const maalTest = {
  name: "MaalChain Testnet",
  shortName: "maal-test",
  chain: "MaalChain Testnet",
  icon: "maal-test",
  rpc: [
    "https://node1.maalscan.io/",
    "https://rpc-bntest.maalscan.io/",
  ],
  faucets: [
    "https://faucet-testnet.maalscan.io/",
  ],
  nativeCurrency: {
    name: "MAAL",
    symbol: "MAAL",
    decimals: 18,
  },
  infoURL: "https://www.maalchain.com/",
  chainId: 7860,
  networkId: 7860,
  explorers: [
    {
      name: "maalscan testnet",
      url: "https://testnet.maalscan.io",
      standard: "EIP3091",
    },
  ],
} as const
