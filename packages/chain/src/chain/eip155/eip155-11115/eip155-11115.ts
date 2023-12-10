import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_11115: Chain = {
  name: "Astra Testnet",
  shortName: "astra-testnet",
  chain: "Astra",
  icon: "astra",
  rpc: [
    "https://rpc.astranaut.dev",
  ],
  faucets: [
    "https://faucet.astranaut.dev",
  ],
  nativeCurrency: {
    name: "test-Astra",
    symbol: "tASA",
    decimals: 18,
  },
  infoURL: "https://astranaut.io",
  chainId: 11115,
  networkId: 11115,
  explorers: [
    {
      name: "Astra EVM Explorer",
      url: "https://explorer.astranaut.dev",
      standard: "EIP3091",
    },
    {
      name: "Astra PingPub Explorer",
      url: "https://ping.astranaut.dev/astra",
      standard: "none",
    },
  ],
}
