import type { Chain } from "../shared"

export const eip155_175200 = {
  name: "Lit Chain Mainnet",
  shortName: "lit",
  chain: "LITKEY",
  icon: "lit",
  rpc: ["https://lit-chain-rpc.litprotocol.com"],
  faucets: [],
  nativeCurrency: {
    name: "Lit Protocol",
    symbol: "LITKEY",
    decimals: 18,
  },
  infoURL: "https://litprotocol.com",
  chainId: 175200,
  networkId: 175200,
  explorers: [
    {
      name: "Lit Chain Explorer",
      url: "https://lit-chain-explorer.litprotocol.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
