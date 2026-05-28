import type { Chain } from "../shared"

export const eip155_411994 = {
  name: "PLN Network",
  shortName: "pln",
  chain: "PLN",
  icon: "pln",
  rpc: ["https://oneagent.uk/rpc"],
  faucets: ["https://oneagent.uk"],
  nativeCurrency: {
    name: "PLN",
    symbol: "PLN",
    decimals: 18,
  },
  infoURL: "https://oneagent.uk",
  chainId: 411994,
  networkId: 411994,
  explorers: [
    {
      name: "PLNScan",
      url: "https://plnscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
