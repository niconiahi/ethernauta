/* eslint no-template-curly-in-string: 0 */
export const eip155_167004 = {
  name: "Taiko (Alpha-2 Testnet)",
  shortName: "taiko-a2",
  chain: "ETH",
  icon: "taiko",
  rpc: [
    "https://rpc.a2.taiko.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://taiko.xyz",
  chainId: 167004,
  networkId: 167004,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.a2.taiko.xyz",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} as const
