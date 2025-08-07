// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_685685 = {
  name: "Gensyn Testnet",
  shortName: "gensyn-test",
  chain: "Gensyn",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.gensyn.ai/",
  chainId: 685685,
  networkId: 685685,
  status: "incubating",
} satisfies Chain
