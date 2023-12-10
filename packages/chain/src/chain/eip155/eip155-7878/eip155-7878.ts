import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_7878: Chain = {
  name: "Hazlor Testnet",
  shortName: "tscas",
  chain: "SCAS",
  rpc: [
    "https://hatlas.rpc.hazlor.com:8545",
    "wss://hatlas.rpc.hazlor.com:8546",
  ],
  faucets: [
    "https://faucet.hazlor.com",
  ],
  nativeCurrency: {
    name: "Hazlor Test Coin",
    symbol: "TSCAS",
    decimals: 18,
  },
  infoURL: "https://hazlor.com",
  chainId: 7878,
  networkId: 7878,
  explorers: [
    {
      name: "Hazlor Testnet Explorer",
      url: "https://explorer.hazlor.com",
      standard: "none",
    },
  ],
}
