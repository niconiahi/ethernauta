import type { Chain } from "../shared"

export const eip155_42429 = {
  name: "Tempo Testnet Andantino (Deprecated)",
  shortName: "tempo-andantino",
  chain: "ETH",
  icon: "tempo",
  rpc: ["https://rpc.testnet.tempo.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "No native currency",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://tempo.xyz",
  chainId: 42429,
  networkId: 42429,
  explorers: [
    {
      name: "tempo-explorer",
      url: "https://explore.andantino.tempo.xyz",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
