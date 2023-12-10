import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1244: Chain = {
  name: "ARC Testnet",
  shortName: "TARC",
  chain: "ARC",
  icon: "arc",
  rpc: [
    "https://rpc-test-1.archiechain.io",
  ],
  faucets: [
    "https://faucet.archiechain.io",
  ],
  nativeCurrency: {
    name: "ARC",
    symbol: "ARC",
    decimals: 18,
  },
  infoURL: "https://archiechain.io/",
  chainId: 1244,
  networkId: 1244,
  explorers: [
    {
      name: "archiescan",
      url: "https://testnet.archiescan.io",
      standard: "none",
    },
  ],
}
