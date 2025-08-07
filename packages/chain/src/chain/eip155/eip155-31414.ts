// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_31414 = {
  name: "Evoke Testnet",
  shortName: "tmthn",
  chain: "Evoke",
  icon: "mthn",
  rpc: ["https://testnet-rpc.evokescan.org"],
  faucets: ["https://faucet.evokescan.org"],
  nativeCurrency: {
    name: "MTHN Testnet",
    symbol: "MTHN",
    decimals: 18,
  },
  infoURL: "https://testnet-explorer.evokescan.org",
  chainId: 31414,
  networkId: 31414,
  explorers: [
    {
      name: "Evoke SmartChain Testnet Explorer",
      url: "https://testnet-explorer.evokescan.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
