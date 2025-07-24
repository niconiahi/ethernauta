/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_188 = {
  "name": "BMC Mainnet",
  "shortName": "BMC",
  "chain": "BMC",
  "rpc": [
    "https://mainnet.bmcchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "chainId": 188,
  "networkId": 188,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmc.blockmeta.com",
      "standard": "none"
    }
  ]
} satisfies Chain