import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_274: Chain = {
  name: "LaChain",
  shortName: "lachain",
  chain: "LaChain",
  icon: "lachain-network",
  rpc: [
    "https://rpc1.mainnet.lachain.network",
    "https://rpc2.mainnet.lachain.network",
    "https://lachain.rpc-nodes.cedalio.dev",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "LaCoin",
    symbol: "LAC",
    decimals: 18,
  },
  infoURL: "",
  chainId: 274,
  networkId: 274,
  explorers: [
    {
      name: "LaChain Explorer",
      url: "https://explorer.lachain.network",
      standard: "EIP3091",
    },
  ],
}
