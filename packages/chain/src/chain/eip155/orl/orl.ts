/* eslint no-template-curly-in-string: 0 */
export const orl = {
  name: "Orlando Chain",
  shortName: "ORL",
  chain: "ORL",
  icon: "orl",
  rpc: [
    "https://rpc-testnet.orlchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Orlando",
    symbol: "ORL",
    decimals: 18,
  },
  infoURL: "https://orlchain.com",
  chainId: 3031,
  networkId: 3031,
  explorers: [
    {
      name: "Orlando (ORL) Explorer",
      url: "https://orlscan.com",
      standard: "EIP3091",
    },
  ],
} as const