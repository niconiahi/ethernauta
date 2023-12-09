/* eslint no-template-curly-in-string: 0 */
export const dc = {
  name: "Dogechain Mainnet",
  shortName: "dc",
  chain: "DC",
  icon: "dogechain",
  rpc: [
    "https://rpc.dogechain.dog",
    "https://rpc01-sg.dogechain.dog",
    "https://rpc.ankr.com/dogechain",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Dogecoin",
    symbol: "DOGE",
    decimals: 18,
  },
  infoURL: "https://dogechain.dog",
  chainId: 2000,
  networkId: 2000,
  explorers: [
    {
      name: "dogechain explorer",
      url: "https://explorer.dogechain.dog",
      standard: "EIP3091",
    },
  ],
} as const
