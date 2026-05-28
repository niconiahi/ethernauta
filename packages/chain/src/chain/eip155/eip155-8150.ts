import type { Chain } from "../shared"

export const eip155_8150 = {
  name: "Alpen Testnet",
  shortName: "alpen-testnet",
  chain: "alpen-testnet",
  icon: "alpen",
  rpc: ["https://rpc.testnet.alpenlabs.io"],
  faucets: ["https://faucet.testnet.alpenlabs.io"],
  features: [],
  nativeCurrency: {
    name: "Signet BTC",
    symbol: "sBTC",
    decimals: 18,
  },
  infoURL: "https://alpenlabs.io/",
  chainId: 8150,
  networkId: 8150,
  explorers: [
    {
      name: "Alpen Blockscout",
      url: "https://explorer.testnet.alpenlabs.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
