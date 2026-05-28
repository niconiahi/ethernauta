import type { Chain } from "../shared"

export const eip155_812242 = {
  name: "Codex Testnet",
  shortName: "codex-testnet",
  chain: "ETH",
  icon: "codex-testnet",
  rpc: [
    "https://rpc.codex-stg.xyz",
    "wss://rpc.codex-stg.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.codex.xyz/",
  chainId: 812242,
  networkId: 812242,
  explorers: [
    {
      name: "Codex Testnet Explorer",
      url: "https://explorer.codex-stg.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
  },
} satisfies Chain
