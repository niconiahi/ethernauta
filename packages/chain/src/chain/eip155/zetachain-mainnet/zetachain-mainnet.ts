/* eslint no-template-curly-in-string: 0 */
export const zetachainMainnet = {
  name: "ZetaChain Mainnet",
  shortName: "zetachain-mainnet",
  chain: "ZetaChain",
  icon: "zetachain",
  rpc: [
    "https://api.mainnet.zetachain.com/evm",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Zeta",
    symbol: "ZETA",
    decimals: 18,
  },
  infoURL: "https://zetachain.com/docs/",
  chainId: 7000,
  networkId: 7000,
  explorers: [
    {
      name: "ZetaChain Mainnet Explorer",
      url: "https://explorer.mainnet.zetachain.com",
      standard: "none",
    },
  ],
  status: "incubating",
} as const
