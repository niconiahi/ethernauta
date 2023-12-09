/* eslint no-template-curly-in-string: 0 */
export const eosLegacy = {
  name: "EOS EVM Legacy",
  shortName: "eos-legacy",
  chain: "EOS",
  rpc: [
    "https://api.eosargentina.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "EOS",
    symbol: "EOS",
    decimals: 18,
  },
  infoURL: "https://eosargentina.io",
  chainId: 59,
  networkId: 59,
  explorers: [],
  status: "deprecated",
} as const
