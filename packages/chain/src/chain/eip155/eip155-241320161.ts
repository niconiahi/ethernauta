// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_241320161 = {
  name: "XMTP Sepolia",
  shortName: "xmtp-sepolia",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  infoURL: "https://xmtp.org",
  chainId: 241320161,
  networkId: 241320161,
  status: "incubating",
} satisfies Chain
