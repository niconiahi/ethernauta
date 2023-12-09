/* eslint no-template-curly-in-string: 0 */
export const velo = {
  name: "VELO Labs Mainnet",
  shortName: "VELO",
  chain: "NOVA chain",
  icon: "novachain",
  rpc: [
    "https://nova.velo.org",
  ],
  faucets: [
    "https://nova-faucet.velo.org",
  ],
  nativeCurrency: {
    name: "Nova",
    symbol: "NOVA",
    decimals: 18,
  },
  infoURL: "https://velo.org",
  chainId: 56789,
  networkId: 56789,
  explorers: [
    {
      name: "novascan",
      url: "https://novascan.velo.org",
      standard: "EIP3091",
    },
  ],
} as const
