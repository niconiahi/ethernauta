/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_90210 = {
  "name": "Beverly Hills",
  "shortName": "bvhl",
  "title": "Ethereum multi-client Verkle Testnet Beverly Hills",
  "chain": "ETH",
  "rpc": [
    "https://rpc.beverlyhills.ethdevops.io:8545"
  ],
  "faucets": [
    "https://faucet.beverlyhills.ethdevops.io"
  ],
  "nativeCurrency": {
    "name": "Beverly Hills Testnet Ether",
    "symbol": "BVE",
    "decimals": 18
  },
  "infoURL": "https://beverlyhills.ethdevops.io",
  "chainId": 90210,
  "networkId": 90210,
  "explorers": [
    {
      "name": "Beverly Hills explorer",
      "url": "https://explorer.beverlyhills.ethdevops.io",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain