// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_869 = {
  name: "WorldMobileChain-Mainnet",
  shortName: "WMC",
  chain: "WMC",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "World Mobile Token",
    symbol: "WMTX",
    decimals: 18,
  },
  infoURL: "https://worldmobile.io/the-chain",
  chainId: 869,
  networkId: 869,
  status: "incubating",
} satisfies Chain
