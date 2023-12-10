import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_20201022: Chain = {
  name: "Pego Network",
  shortName: "pg",
  chain: "PEGO",
  icon: "pego",
  rpc: [
    "https://pegorpc.com",
    "https://node1.pegorpc.com",
    "https://node2.pegorpc.com",
    "https://node3.pegorpc.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Pego Native Token",
    symbol: "PG",
    decimals: 18,
  },
  infoURL: "https://pego.network",
  chainId: 20201022,
  networkId: 20201022,
  explorers: [
    {
      name: "Pego Network Explorer",
      url: "https://scan.pego.network",
      standard: "EIP3091",
    },
  ],
}
