import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_14288640: Chain = {
  name: "Anduschain Mainnet",
  shortName: "anduschain-mainnet",
  chain: "anduschain",
  rpc: [
    "https://rpc.anduschain.io/rpc",
    "wss://rpc.anduschain.io/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "DAON",
    symbol: "DEB",
    decimals: 18,
  },
  infoURL: "https://anduschain.io/",
  chainId: 14288640,
  networkId: 14288640,
  explorers: [
    {
      name: "anduschain explorer",
      url: "https://explorer.anduschain.io",
      standard: "none",
    },
  ],
}
