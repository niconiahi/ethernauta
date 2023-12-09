/* eslint no-template-curly-in-string: 0 */
export const eip155_2019 = {
  name: "PublicMint Testnet",
  shortName: "pmint_test",
  title: "Public Mint Testnet",
  chain: "PublicMint",
  rpc: [
    "https://rpc.tst.publicmint.io:8545",
  ],
  faucets: [],
  nativeCurrency: {
    name: "USD",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://publicmint.com",
  chainId: 2019,
  networkId: 2019,
  slip44: 60,
  explorers: [
    {
      name: "PublicMint Explorer",
      url: "https://explorer.tst.publicmint.io",
      standard: "EIP3091",
    },
  ],
} as const
