import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_740: Chain = {
  name: "Canto Testnet",
  shortName: "tcanto",
  chain: "Canto Tesnet",
  rpc: [
    "https://eth.plexnode.wtf/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Canto",
    symbol: "CANTO",
    decimals: 18,
  },
  infoURL: "https://canto.io",
  chainId: 740,
  networkId: 740,
  explorers: [
    {
      name: "Canto Tesnet Explorer (Neobase)",
      url: "https://testnet-explorer.canto.neobase.one",
      standard: "none",
    },
  ],
  status: "deprecated",
}
