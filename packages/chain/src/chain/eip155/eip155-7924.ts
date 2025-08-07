// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7924 = {
  name: "MO Mainnet",
  shortName: "MO",
  chain: "MO",
  icon: "mo",
  rpc: ["https://mainnet-rpc.mochain.app/"],
  faucets: ["https://faucet.mochain.app/"],
  nativeCurrency: {
    name: "MO",
    symbol: "MO",
    decimals: 18,
  },
  infoURL: "https://mochain.app",
  chainId: 7924,
  networkId: 7924,
  explorers: [
    {
      name: "MO Explorer",
      url: "https://moscan.app",
      standard: "none",
    },
  ],
} satisfies Chain
