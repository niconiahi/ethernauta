// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2022091 = {
  name: "Alterscope Testnet",
  shortName: "AlterscopeTest",
  chain: "AlterscopeTest",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "RISK Test Token",
    symbol: "RISKT",
    decimals: 18,
  },
  infoURL: "https://alterscope.org",
  chainId: 2022091,
  networkId: 2022091,
  status: "incubating",
} satisfies Chain
