import type { Chain } from "../shared"

export const eip155_8000008 = {
  name: "MAKI Chain",
  shortName: "maki",
  chain: "MAKI",
  rpc: ["https://rpc.makiai.app"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://makiai.app",
  chainId: 8000008,
  networkId: 8000008,
} satisfies Chain
