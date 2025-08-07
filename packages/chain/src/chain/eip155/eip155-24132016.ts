// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_24132016 = {
  name: "XMTP",
  shortName: "xmtp",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://xmtp.org",
  chainId: 24132016,
  networkId: 24132016,
  status: "incubating",
} satisfies Chain
