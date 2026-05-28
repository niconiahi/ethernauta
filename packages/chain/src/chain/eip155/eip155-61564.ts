import type { Chain } from "../shared"

export const eip155_61564 = {
  name: "Gelatine Network",
  shortName: "jello",
  chain: "JELLO",
  icon: "jello",
  rpc: ["https://rpc.pine.ink"],
  faucets: ["https://gelatine.pine.ink"],
  nativeCurrency: {
    name: "JELLO",
    symbol: "JELLO",
    decimals: 18,
  },
  infoURL: "https://gelatine.pine.ink",
  chainId: 61564,
  networkId: 61564,
  explorers: [
    {
      name: "Gelatine Explorer",
      url: "https://explorer.pine.ink",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
