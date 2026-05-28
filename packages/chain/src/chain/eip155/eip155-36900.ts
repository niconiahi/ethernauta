import type { Chain } from "../shared"

export const eip155_36900 = {
  name: "ADI Chain",
  shortName: "adi",
  chain: "ADI",
  icon: "adi",
  rpc: ["https://rpc.adifoundation.ai"],
  faucets: [],
  nativeCurrency: {
    name: "ADI",
    symbol: "ADI",
    decimals: 18,
  },
  infoURL: "https://adifoundation.ai",
  chainId: 36900,
  networkId: 36900,
  explorers: [
    {
      name: "ADI Explorer",
      url: "https://explorer.adifoundation.ai",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
