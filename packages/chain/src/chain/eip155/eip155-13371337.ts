// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_13371337 = {
  name: "PepChain Churchill",
  shortName: "tpep",
  chain: "PEP",
  rpc: ["https://churchill-rpc.pepchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "PepChain Churchill Ether",
    symbol: "TPEP",
    decimals: 18,
  },
  infoURL: "https://pepchain.io",
  chainId: 13371337,
  networkId: 13371337,
} satisfies Chain
