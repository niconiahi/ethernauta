import type { Chain } from "../shared"

export const eip155_7447 = {
  name: "TokClaw Blockchain",
  shortName: "TokClaw",
  chain: "TOKCLAW",
  rpc: ["https://rpc.tokclaw.com"],
  faucets: [],
  nativeCurrency: {
    name: "FEE",
    symbol: "FEE",
    decimals: 6,
  },
  infoURL: "https://tokclaw.com",
  chainId: 7447,
  networkId: 7447,
  explorers: [
    {
      name: "TokClaw Explorer",
      url: "https://exp.tokclaw.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
