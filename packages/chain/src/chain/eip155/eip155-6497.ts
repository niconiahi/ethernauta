import type { Chain } from "../shared"

export const eip155_6497 = {
  name: "MIZUHIKI Testnet Awaji",
  shortName: "awaji",
  chain: "MIZU",
  rpc: ["https://rpc.awaji.mizuhiki.io"],
  faucets: ["https://faucet.awaji.mizuhiki.io"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "MIZU",
    symbol: "MIZU",
    decimals: 18,
  },
  infoURL: "https://mizuhiki.io/",
  chainId: 6497,
  networkId: 6497,
  explorers: [
    {
      name: "blockscout",
      url: "https://awaji.blockscout.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
