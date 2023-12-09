/* eslint no-template-curly-in-string: 0 */
export const sapphire = {
  name: "Oasis Sapphire",
  shortName: "sapphire",
  chain: "Sapphire",
  icon: "oasis",
  rpc: [
    "https://sapphire.oasis.io",
    "wss://sapphire.oasis.io/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sapphire Rose",
    symbol: "ROSE",
    decimals: 18,
  },
  infoURL: "https://docs.oasis.io/dapp/sapphire",
  chainId: 23294,
  networkId: 23294,
  explorers: [
    {
      name: "Oasis Sapphire Explorer",
      url: "https://explorer.sapphire.oasis.io",
      standard: "EIP3091",
    },
  ],
} as const
