// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9746 = {
  name: "Plasma Testnet",
  shortName: "plasma-testnet",
  chain: "Plasma",
  icon: "plasma",
  rpc: ["https://testnet-rpc.plasma.to"],
  faucets: [],
  nativeCurrency: {
    name: "Testnet Plasma",
    symbol: "XPL",
    decimals: 18,
  },
  infoURL: "https://plasma.to",
  chainId: 9746,
  networkId: 9746,
  explorers: [
    {
      name: "Routescan",
      url: "https://testnet.plasmascan.to",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
