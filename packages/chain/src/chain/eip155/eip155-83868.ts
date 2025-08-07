/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_83868 = {
  "name": "Xprotocol Sepolia",
  "shortName": "xprotocolsepolia",
  "chain": "Xprotocol Sepolia",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "KICK Testnet Token",
    "symbol": "KICK",
    "decimals": 18
  },
  "infoURL": "https://xprotocol.org/",
  "chainId": 83868,
  "networkId": 83868,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-84532"
  },
  "status": "incubating"
} satisfies Chain