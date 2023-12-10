import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_338: Chain = {
  name: "Cronos Testnet",
  shortName: "tcro",
  chain: "CRO",
  rpc: [
    "https://evm-t3.cronos.org",
  ],
  faucets: [
    "https://cronos.org/faucet",
  ],
  nativeCurrency: {
    name: "Cronos Test Coin",
    symbol: "TCRO",
    decimals: 18,
  },
  infoURL: "https://cronos.org",
  chainId: 338,
  networkId: 338,
  explorers: [
    {
      name: "Cronos Testnet Explorer",
      url: "https://explorer.cronos.org/testnet",
      standard: "none",
    },
  ],
}
