import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1986: Chain = {
  name: "SatoshIE Testnet",
  shortName: "satoshie_testnet",
  chain: "TUSHY",
  icon: "satoshie",
  rpc: [
    "http://testnet.satosh.ie",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Tushy Token",
    symbol: "TUSHY",
    decimals: 18,
  },
  infoURL: "https://satosh.ie",
  chainId: 1986,
  networkId: 1986,
  explorers: [
    {
      name: "testnetexplorer",
      url: "http://explore-testnet.satosh.ie",
      standard: "none",
    },
  ],
}
