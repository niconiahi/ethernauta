/* eslint no-template-curly-in-string: 0 */
export const dstg = {
  name: "Diode Testnet Staging",
  shortName: "dstg",
  chain: "DIODE",
  rpc: [
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Staging Diodes",
    symbol: "sDIODE",
    decimals: 18,
  },
  infoURL: "https://diode.io/staging",
  chainId: 13,
  networkId: 13,
} as const
