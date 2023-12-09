/* eslint no-template-curly-in-string: 0 */
export const toronet = {
  name: "Toronet Mainnet",
  shortName: "Toronet",
  chain: "Toronet",
  icon: "toronet",
  rpc: [
    "http://toronet.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Toro",
    symbol: "TORO",
    decimals: 18,
  },
  infoURL: "https://toronet.org",
  chainId: 77777,
  networkId: 77777,
  ens: {
    registry: "0x1f45a71f4aAD769E27c969c4359E0e250C67165c",
  },
  explorers: [
    {
      name: "toronet_explorer",
      url: "https://toronet.org/explorer",
      standard: "none",
    },
  ],
} as const
