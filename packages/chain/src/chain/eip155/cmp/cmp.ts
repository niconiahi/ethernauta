/* eslint no-template-curly-in-string: 0 */
export const cmp = {
  name: "CMP-Testnet",
  shortName: "cmp",
  chain: "CMP",
  rpc: [
    "https://galaxy.block.caduceus.foundation",
    "wss://galaxy.block.caduceus.foundation",
  ],
  faucets: [
    "https://dev.caduceus.foundation/testNetwork",
  ],
  nativeCurrency: {
    name: "Caduceus Testnet Token",
    symbol: "CMP",
    decimals: 18,
  },
  infoURL: "https://caduceus.foundation/",
  chainId: 512512,
  networkId: 512512,
  explorers: [
    {
      name: "Galaxy Scan",
      url: "https://galaxy.scan.caduceus.foundation",
      standard: "none",
    },
  ],
} as const
