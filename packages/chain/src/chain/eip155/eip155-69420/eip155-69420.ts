import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_69420: Chain = {
  name: "Condrieu",
  shortName: "cndr",
  title: "Ethereum Verkle Testnet Condrieu",
  chain: "ETH",
  rpc: [
    "https://rpc.condrieu.ethdevops.io:8545",
  ],
  faucets: [
    "https://faucet.condrieu.ethdevops.io",
  ],
  nativeCurrency: {
    name: "Condrieu Testnet Ether",
    symbol: "CTE",
    decimals: 18,
  },
  infoURL: "https://condrieu.ethdevops.io",
  chainId: 69420,
  networkId: 69420,
  explorers: [
    {
      name: "Condrieu explorer",
      url: "https://explorer.condrieu.ethdevops.io",
      standard: "none",
    },
  ],
}
