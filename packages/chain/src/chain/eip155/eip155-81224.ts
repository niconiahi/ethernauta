import type { Chain } from "../shared"

export const eip155_81224 = {
  name: "Codex",
  shortName: "codex",
  chain: "ETH",
  icon: "codex",
  rpc: ["https://rpc.codex.xyz", "wss://rpc.codex.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.codex.xyz/",
  chainId: 81224,
  networkId: 81224,
  explorers: [
    {
      name: "Codex Explorer",
      url: "https://explorer.codex.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-1",
  },
} satisfies Chain
