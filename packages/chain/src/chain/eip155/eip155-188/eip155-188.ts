import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_188: Chain = {
  name: "BMC Mainnet",
  shortName: "BMC",
  chain: "BMC",
  rpc: [
    "https://mainnet.bmcchain.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTM",
    symbol: "BTM",
    decimals: 18,
  },
  infoURL: "https://bmc.bytom.io/",
  chainId: 188,
  networkId: 188,
  explorers: [
    {
      name: "Blockmeta",
      url: "https://bmc.blockmeta.com",
      standard: "none",
    },
  ],
}
