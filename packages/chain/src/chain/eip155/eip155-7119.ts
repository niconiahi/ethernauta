import type { Chain } from "../shared"

export const eip155_7119 = {
  name: "Sentrix Chain",
  shortName: "srx",
  chain: "Sentrix",
  icon: "sentrix",
  rpc: ["https://rpc.sentrixchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Sentrix",
    symbol: "SRX",
    decimals: 18,
  },
  infoURL: "https://sentrixchain.com",
  chainId: 7119,
  networkId: 7119,
  explorers: [
    {
      name: "Sentrix Scan",
      url: "https://scan.sentrixchain.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
