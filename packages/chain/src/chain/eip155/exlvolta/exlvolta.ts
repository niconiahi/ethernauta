/* eslint no-template-curly-in-string: 0 */
export const exlvolta = {
  name: "Excoincial Chain Volta-Testnet",
  shortName: "exlvolta",
  chain: "TEXL",
  icon: "exl",
  rpc: [
    "https://testnet-rpc.exlscan.com",
  ],
  faucets: [
    "https://faucet.exlscan.com",
  ],
  nativeCurrency: {
    name: "TExlcoin",
    symbol: "TEXL",
    decimals: 18,
  },
  infoURL: "",
  chainId: 27082017,
  networkId: 27082017,
  explorers: [
    {
      name: "exlscan",
      url: "https://testnet-explorer.exlscan.com",
      standard: "EIP3091",
    },
  ],
} as const
