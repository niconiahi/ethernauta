/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_62831 = {
  "name": "PLYR TAU Testnet",
  "shortName": "plyr-tau-testnet",
  "chain": "PLYR",
  "icon": "plyr",
  "rpc": [
    "https://subnets.avax.network/plyr/testnet/rpc"
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=plyr"
  ],
  "nativeCurrency": {
    "name": "PLYR",
    "symbol": "PLYR",
    "decimals": 18
  },
  "infoURL": "https://plyr.network",
  "chainId": 62831,
  "networkId": 62831,
  "slip44": 1,
  "explorers": [
    {
      "name": "PLYR TAU Explorer",
      "url": "https://explorer-testnet.plyr.network",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain