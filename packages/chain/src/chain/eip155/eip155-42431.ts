import type { Chain } from "../shared"

export const eip155_42431 = {
  name: "Tempo Testnet Moderato",
  shortName: "tempo-moderato",
  chain: "ETH",
  icon: "tempo",
  rpc: [
    "https://rpc.moderato.tempo.xyz",
    "wss://rpc.moderato.tempo.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "No native currency",
    symbol: "USD",
    decimals: 18,
  },
  infoURL: "https://tempo.xyz",
  chainId: 42431,
  networkId: 42431,
  explorers: [
    {
      name: "tempo-explorer",
      url: "https://explore.testnet.tempo.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
