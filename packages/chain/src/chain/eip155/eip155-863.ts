// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_863 = {
  name: "Radius Testnet",
  shortName: "radius-testnet",
  chain: "Radius",
  rpc: ["https://dev-secure.rpc.theradius.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "Useless",
    symbol: "USLS",
    decimals: 18,
  },
  infoURL: "https://www.theradius.xyz/",
  chainId: 863,
  networkId: 863,
} satisfies Chain
