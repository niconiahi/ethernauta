/* eslint no-template-curly-in-string: 0 */
export const enulst = {
  name: "ENULS Testnet",
  shortName: "enulst",
  chain: "ENULS",
  icon: "enuls",
  rpc: [
    "https://beta.evmapi.nuls.io",
    "https://beta.evmapi2.nuls.io",
  ],
  faucets: [
    "http://faucet.nuls.io",
  ],
  nativeCurrency: {
    name: "NULS",
    symbol: "NULS",
    decimals: 18,
  },
  infoURL: "https://nuls.io",
  chainId: 120,
  networkId: 120,
  explorers: [
    {
      name: "enulsscan",
      url: "https://beta.evmscan.nuls.io",
      standard: "EIP3091",
    },
  ],
} as const
