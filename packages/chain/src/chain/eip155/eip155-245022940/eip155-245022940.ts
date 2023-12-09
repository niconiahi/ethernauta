/* eslint no-template-curly-in-string: 0 */
export const eip155_245022940 = {
  name: "Neon EVM TestNet",
  shortName: "neonevm-testnet",
  chain: "Solana",
  icon: "neon",
  rpc: [
    "https://testnet.neonevm.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Neon",
    symbol: "NEON",
    decimals: 18,
  },
  infoURL: "https://neon-labs.org",
  chainId: 245022940,
  networkId: 245022940,
  explorers: [
    {
      name: "native",
      url: "https://testnet.explorer.neon-labs.org",
      standard: "EIP3091",
    },
    {
      name: "neonscan",
      url: "https://testnet.neonscan.org",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} as const
