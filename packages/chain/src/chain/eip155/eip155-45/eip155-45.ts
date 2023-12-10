import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_45: Chain = {
  name: "Darwinia Pangoro Testnet",
  shortName: "pangoro",
  chain: "pangoro",
  rpc: [
    "https://pangoro-rpc.darwinia.network",
  ],
  faucets: [
    "https://docs.darwinia.network/pangoro-testnet-70cfec5dc9ca42759959ba3803edaec2",
  ],
  nativeCurrency: {
    name: "Pangoro Network Native Token",
    symbol: "ORING",
    decimals: 18,
  },
  infoURL: "https://darwinia.network/",
  chainId: 45,
  networkId: 45,
  explorers: [
    {
      name: "subscan",
      url: "https://pangoro.subscan.io",
      standard: "none",
    },
  ],
}
