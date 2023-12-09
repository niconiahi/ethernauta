/* eslint no-template-curly-in-string: 0 */
export const exn = {
  name: "Exosama Network",
  shortName: "exn",
  chain: "EXN",
  icon: "exn",
  rpc: [
    "https://rpc.exosama.com",
    "wss://rpc.exosama.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sama Token",
    symbol: "SAMA",
    decimals: 18,
  },
  infoURL: "https://moonsama.com",
  chainId: 2109,
  networkId: 2109,
  slip44: 2109,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.exosama.com",
      standard: "EIP3091",
    },
  ],
} as const