/* eslint no-template-curly-in-string: 0 */
export const thetaAmber = {
  name: "Theta Amber Testnet",
  shortName: "theta-amber",
  chain: "Theta",
  rpc: [
    "https://eth-rpc-api-amber.thetatoken.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Theta Fuel",
    symbol: "TFUEL",
    decimals: 18,
  },
  infoURL: "https://www.thetatoken.org/",
  chainId: 364,
  networkId: 364,
  explorers: [
    {
      name: "Theta Amber Testnet Explorer",
      url: "https://guardian-testnet-amber-explorer.thetatoken.org",
      standard: "EIP3091",
    },
  ],
} as const