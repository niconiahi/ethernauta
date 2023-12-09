/* eslint no-template-curly-in-string: 0 */
export const twlc = {
  name: "Worldland Testnet",
  shortName: "TWLC",
  chain: "Worldland",
  icon: "worldland",
  rpc: [
    "https://gwangju.worldland.foundation",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Worldland",
    symbol: "WL",
    decimals: 18,
  },
  infoURL: "https://worldland.foundation",
  chainId: 10395,
  networkId: 10395,
  explorers: [
    {
      name: "Worldland Explorer",
      url: "https://testscan.worldland.foundation",
      standard: "EIP3091",
    },
  ],
} as const
