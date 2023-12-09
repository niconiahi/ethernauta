/* eslint no-template-curly-in-string: 0 */
export const neutr = {
  name: "Neutrinos TestNet",
  shortName: "NEUTR",
  chain: "NEUTR",
  rpc: [
    "https://testnet-rpc.neutrinoschain.com",
  ],
  faucets: [
    "https://neutrinoschain.com/faucet",
  ],
  nativeCurrency: {
    name: "Neutrinos",
    symbol: "NEUTR",
    decimals: 18,
  },
  infoURL: "https://docs.neutrinoschain.com",
  chainId: 197,
  networkId: 197,
  explorers: [
    {
      name: "blockscout",
      url: "https://testnet.neutrinoschain.com",
      standard: "EIP3091",
    },
  ],
} as const
