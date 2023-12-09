/* eslint no-template-curly-in-string: 0 */
export const eip155_568 = {
  name: "Dogechain Testnet",
  shortName: "dct",
  chain: "DC",
  icon: "dogechain",
  rpc: [
    "https://rpc-testnet.dogechain.dog",
  ],
  faucets: [
    "https://faucet.dogechain.dog",
  ],
  nativeCurrency: {
    name: "Dogecoin",
    symbol: "DOGE",
    decimals: 18,
  },
  infoURL: "https://dogechain.dog",
  chainId: 568,
  networkId: 568,
  explorers: [
    {
      name: "dogechain testnet explorer",
      url: "https://explorer-testnet.dogechain.dog",
      standard: "EIP3091",
    },
  ],
} as const