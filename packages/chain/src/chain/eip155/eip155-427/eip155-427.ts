import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_427: Chain = {
  name: "Zeeth Chain",
  shortName: "zeeth",
  chain: "ZeethChain",
  rpc: [
    "https://rpc.zeeth.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Zeeth Token",
    symbol: "ZTH",
    decimals: 18,
  },
  infoURL: "",
  chainId: 427,
  networkId: 427,
  explorers: [
    {
      name: "Zeeth Explorer",
      url: "https://explorer.zeeth.io",
      standard: "none",
    },
  ],
}
