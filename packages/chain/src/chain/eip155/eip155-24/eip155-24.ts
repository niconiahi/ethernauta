import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_24: Chain = {
  name: "KardiaChain Mainnet",
  shortName: "kardiachain",
  chain: "KAI",
  icon: "kardiachain",
  rpc: [
    "https://rpc.kardiachain.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "KardiaChain",
    symbol: "KAI",
    decimals: 18,
  },
  infoURL: "https://kardiachain.io",
  chainId: 24,
  networkId: 0,
  redFlags: [
    "reusedChainId",
  ],
}
