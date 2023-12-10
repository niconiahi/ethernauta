import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_189: Chain = {
  name: "BMC Testnet",
  shortName: "BMCT",
  chain: "BMC",
  rpc: [
    "https://testnet.bmcchain.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTM",
    symbol: "BTM",
    decimals: 18,
  },
  infoURL: "https://bmc.bytom.io/",
  chainId: 189,
  networkId: 189,
  explorers: [
    {
      name: "Blockmeta",
      url: "https://bmctestnet.blockmeta.com",
      standard: "none",
    },
  ],
}
