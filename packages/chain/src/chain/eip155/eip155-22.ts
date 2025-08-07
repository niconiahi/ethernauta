// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_22 = {
  name: "ELA-DID-Sidechain Mainnet",
  shortName: "eladid",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Elastos",
    symbol: "ELA",
    decimals: 18,
  },
  infoURL: "https://www.elastos.org/",
  chainId: 22,
  networkId: 22,
} satisfies Chain
