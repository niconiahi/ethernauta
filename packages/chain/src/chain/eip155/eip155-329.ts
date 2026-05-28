import type { Chain } from "../shared"

export const eip155_329 = {
  name: "VirBiCoin",
  shortName: "virbicoin",
  chain: "VBC",
  icon: "vbc",
  rpc: ["https://rpc.digitalregion.jp"],
  faucets: [],
  nativeCurrency: {
    name: "VBC",
    symbol: "VBC",
    decimals: 18,
  },
  infoURL: "https://vbc.digitalregion.jp",
  chainId: 329,
  networkId: 329,
  explorers: [
    {
      name: "VirBiCoin Explorer",
      url: "https://explorer.digitalregion.jp",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
