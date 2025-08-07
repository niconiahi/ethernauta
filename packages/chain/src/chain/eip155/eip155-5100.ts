// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5100 = {
  name: "Syndicate Testnet",
  shortName: "syndicate-chain-testnet",
  title: "Syndicate Testnet",
  chain: "Syndicate",
  icon: "syndicate",
  rpc: ["https://rpc-testnet.syndicate.io"],
  faucets: [],
  nativeCurrency: {
    name: "S-Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://syndicate.io",
  chainId: 5100,
  networkId: 5100,
  status: "incubating",
} satisfies Chain
