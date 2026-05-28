import type { Chain } from "../shared"

export const eip155_4217 = {
  name: "Tempo Mainnet Presto",
  shortName: "tempo-presto",
  chain: "ETH",
  icon: "tempo",
  rpc: [
    "https://rpc.mainnet.tempo.xyz",
    "wss://rpc.mainnet.tempo.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "No native currency",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://tempo.xyz",
  chainId: 4217,
  networkId: 4217,
  explorers: [
    {
      name: "tempo-explorer",
      url: "https://explore.tempo.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
