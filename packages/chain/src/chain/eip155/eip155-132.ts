// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_132 = {
  name: "Namefi Chain Mainnet",
  shortName: "nfic",
  chain: "NFIC",
  rpc: ["https://rpc.chain.namefi.io"],
  faucets: [],
  nativeCurrency: {
    name: "Namefi Coin",
    symbol: "NFIC",
    decimals: 18,
  },
  infoURL: "https://namefi.io/",
  chainId: 132,
  networkId: 132,
} satisfies Chain
