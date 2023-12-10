import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3141592: Chain = {
  name: "Filecoin - Butterfly testnet",
  shortName: "filecoin-butterfly",
  chain: "FIL",
  icon: "filecoin",
  rpc: [],
  faucets: [
    "https://faucet.butterfly.fildev.network",
  ],
  nativeCurrency: {
    name: "testnet filecoin",
    symbol: "tFIL",
    decimals: 18,
  },
  infoURL: "https://filecoin.io",
  chainId: 3141592,
  networkId: 3141592,
  slip44: 1,
  explorers: [],
  status: "incubating",
}
