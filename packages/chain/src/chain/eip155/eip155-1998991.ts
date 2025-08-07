// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_1998991 = {
  name: "Xphere Testnet",
  shortName: "xp-test",
  chain: "Xphere Testnet",
  icon: "xphere",
  rpc: ["http://testnet.x-phere.com"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Xphere Testnet",
    symbol: "XPT",
    decimals: 18,
  },
  infoURL: "https://x-phere.com/",
  chainId: 1998991,
  networkId: 1998991,
  explorers: [],
} satisfies Chain
