import type { Chain } from "../shared"

export const eip155_8721 = {
  name: "EB-Chain",
  shortName: "ebc",
  chain: "EBC",
  icon: "ebc",
  rpc: ["https://rpc.ebcscan.net"],
  faucets: ["https://ebcscan.net/faucet"],
  nativeCurrency: {
    name: "EBC",
    symbol: "EBC",
    decimals: 18,
  },
  infoURL: "https://ebcscan.net",
  chainId: 8721,
  networkId: 8721,
  explorers: [
    {
      name: "EBCScan",
      url: "https://ebcscan.net",
      standard: "none",
    },
  ],
} satisfies Chain
