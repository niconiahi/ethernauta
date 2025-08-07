// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_4786 = {
  name: "Evnode Testnet",
  shortName: "evnode",
  chain: "Evnode",
  icon: "evnode",
  rpc: ["https://rpc-testnet.evnode.org/"],
  faucets: ["https://faucet.evnode.org"],
  nativeCurrency: {
    name: "Evnode Testnet Native Token",
    symbol: "tEVO",
    decimals: 18,
  },
  infoURL: "https://evnode.org",
  chainId: 4786,
  networkId: 4786,
  explorers: [
    {
      name: "Evnode Explorer Testnet",
      url: "https://testnet.evscan.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
