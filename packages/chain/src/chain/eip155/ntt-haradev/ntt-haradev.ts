/* eslint no-template-curly-in-string: 0 */
export const nttHaradev = {
  name: "Haradev Testnet",
  shortName: "ntt-haradev",
  chain: "Ntity",
  icon: "ntity",
  rpc: [
    "https://blockchain.haradev.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ntity Haradev",
    symbol: "NTTH",
    decimals: 18,
  },
  infoURL: "https://ntity.io",
  chainId: 197710212031,
  networkId: 197710212031,
  explorers: [
    {
      name: "Ntity Haradev Blockscout",
      url: "https://blockscout.haradev.com",
      standard: "EIP3091",
    },
  ],
} as const
