/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_325000 = {
  "name": "Camp Network Testnet V2",
  "shortName": "CampV2",
  "chain": "ETH",
  "icon": "camp",
  "rpc": [
    "https://rpc-campnetwork.xyz"
  ],
  "faucets": [
    "https://www.campnetwork.xyz/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.campnetwork.xyz/",
  "chainId": 325000,
  "networkId": 325000,
  "slip44": 1,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://camp-network-testnet.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/camp-network-testnet"
      }
    ]
  }
} satisfies Chain