import type { Chain } from "../shared"

export const eip155_9747 = {
  name: "Plasma Devnet",
  shortName: "plasma-devnet",
  chain: "Plasma",
  icon: "plasma",
  rpc: ["https://devnet-rpc.plasma.to"],
  faucets: [],
  nativeCurrency: {
    name: "Devnet Plasma",
    symbol: "XPL",
    decimals: 18,
  },
  infoURL: "https://plasma.to",
  chainId: 9747,
  networkId: 9747,
  explorers: [],
} satisfies Chain
