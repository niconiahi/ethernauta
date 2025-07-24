/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_189 = {
  "name": "BMC Testnet",
  "shortName": "BMCT",
  "chain": "BMC",
  "rpc": [
    "https://testnet.bmcchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "chainId": 189,
  "networkId": 189,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmctestnet.blockmeta.com",
      "standard": "none"
    }
  ]
} satisfies Chain