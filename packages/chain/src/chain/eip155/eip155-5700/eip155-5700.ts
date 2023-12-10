import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_5700: Chain = {
  name: "Syscoin Tanenbaum Testnet",
  shortName: "tsys",
  chain: "SYS",
  rpc: [
    "https://rpc.tanenbaum.io",
    "wss://rpc.tanenbaum.io/wss",
    "https://syscoin-tanenbaum-evm.publicnode.com",
    "wss://syscoin-tanenbaum-evm.publicnode.com",
  ],
  faucets: [
    "https://faucet.tanenbaum.io",
  ],
  nativeCurrency: {
    name: "Testnet Syscoin",
    symbol: "tSYS",
    decimals: 18,
  },
  infoURL: "https://syscoin.org",
  chainId: 5700,
  networkId: 5700,
  explorers: [
    {
      name: "Syscoin Testnet Block Explorer",
      url: "https://tanenbaum.io",
      standard: "EIP3091",
    },
  ],
}
