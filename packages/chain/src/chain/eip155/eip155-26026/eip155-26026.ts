import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_26026: Chain = {
  name: "Ferrum Testnet",
  shortName: "frm",
  chain: "tFRM",
  rpc: [
    "http://testnet.dev.svcs.ferrumnetwork.io:9933",
  ],
  faucets: [
    "https://testnet.faucet.ferrumnetwork.io",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Ferrum",
    symbol: "tFRM",
    decimals: 18,
  },
  infoURL: "https://ferrum.network",
  chainId: 26026,
  networkId: 26026,
  explorers: [
    {
      name: "polkadotjs",
      url: "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet.dev.svcs.ferrumnetwork.io#/explorer",
      standard: "none",
    },
  ],
}
