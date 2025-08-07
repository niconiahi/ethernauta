// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_610 = {
  name: "Darwin Devnet",
  shortName: "darwin-devnet",
  chain: "Darwin",
  icon: "darwin",
  rpc: ["https://devnet-rpc.darwinchain.ai"],
  faucets: ["https://devnet-rpc.darwinchain.ai/faucet"],
  nativeCurrency: {
    name: "Darwin Devnet token",
    symbol: "DNA",
    decimals: 18,
  },
  infoURL: "https://darwinchain.ai",
  chainId: 610,
  networkId: 610,
  explorers: [
    {
      name: "Darwin Explorer",
      url: "https://explorer.darwinchain.ai",
      standard: "none",
    },
  ],
} satisfies Chain
