/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_168587773 = {
  "name": "Blast Sepolia Testnet",
  "shortName": "blastsepolia",
  "chain": "ETH",
  "icon": "blast",
  "rpc": [
    "https://sepolia.blast.io",
    "https://blast-sepolia.drpc.org",
    "wss://blast-sepolia.drpc.org"
  ],
  "faucets": [
    "https://faucet.quicknode.com/blast/sepolia"
  ],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://blast.io/",
  "chainId": 168587773,
  "networkId": 168587773,
  "explorers": [
    {
      "name": "Blast Sepolia Explorer",
      "url": "https://testnet.blastscan.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  }
} satisfies Chain