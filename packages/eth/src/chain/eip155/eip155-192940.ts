/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_192940 = {
  "name": "Mind Network Testnet",
  "shortName": "fhet",
  "chain": "FHET",
  "rpc": [
    "https://rpc-testnet.mindnetwork.xyz",
    "wss://rpc-testnet.mindnetwork.xyz"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://mindnetwork.xyz",
  "chainId": 192940,
  "networkId": 192940
} satisfies Chain