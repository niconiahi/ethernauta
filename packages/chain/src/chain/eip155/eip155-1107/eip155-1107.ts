import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1107: Chain = {
  name: "BLXq Testnet",
  shortName: "tblxq",
  chain: "BLXQ",
  icon: "blxq",
  rpc: [
    "https://testnetq1.blx.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BLXQ",
    symbol: "BLXQ",
    decimals: 18,
  },
  infoURL: "https://blx.org",
  chainId: 1107,
  networkId: 1107,
  explorers: [
    {
      name: "BLXq Explorer",
      url: "https://explorer.blx.org",
      standard: "none",
    },
  ],
}
