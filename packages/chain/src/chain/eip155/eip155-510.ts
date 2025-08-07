// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_510 = {
  name: "Syndicate Chain",
  shortName: "syndicate-chain-mainnet",
  title: "Syndicate Chain",
  chain: "Syndicate",
  icon: "syndicate",
  rpc: ["https://rpc-mainnet.syndicate.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://syndicate.io",
  chainId: 510,
  networkId: 510,
  status: "incubating",
} satisfies Chain
