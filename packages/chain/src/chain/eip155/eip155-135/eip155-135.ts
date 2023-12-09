/* eslint no-template-curly-in-string: 0 */
export const eip155_135 = {
  name: "Alyx Chain Testnet",
  shortName: "AlyxTestnet",
  chain: "Alyx Chain Testnet",
  icon: "alyx",
  rpc: [
    "https://testnet-rpc.alyxchain.com",
  ],
  faucets: [
    "https://faucet.alyxchain.com",
  ],
  nativeCurrency: {
    name: "Alyx Testnet Native Token",
    symbol: "ALYX",
    decimals: 18,
  },
  infoURL: "https://www.alyxchain.com",
  chainId: 135,
  networkId: 135,
  explorers: [
    {
      name: "alyx testnet scan",
      url: "https://testnet.alyxscan.com",
      standard: "EIP3091",
    },
  ],
} as const
