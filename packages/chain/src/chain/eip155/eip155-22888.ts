import type { Chain } from "../shared"

export const eip155_22888 = {
  name: "Access Network",
  shortName: "access",
  chain: "ACCESS",
  icon: "access",
  rpc: ["https://accesschain.org/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Access Coin",
    symbol: "ACCESS",
    decimals: 18,
  },
  infoURL: "https://accesschain.org",
  chainId: 22888,
  networkId: 22888,
  explorers: [
    {
      name: "Access Network Explorer",
      url: "https://accesschain.org/explorer",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
