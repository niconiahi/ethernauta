/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_534351 = {
  "name": "Scroll Sepolia Testnet",
  "shortName": "scr-sepolia",
  "chain": "ETH",
  "rpc": [
    "https://sepolia-rpc.scroll.io",
    "https://rpc.ankr.com/scroll_sepolia_testnet",
    "https://scroll-sepolia.chainstacklabs.com",
    "https://scroll-testnet-public.unifra.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "chainId": 534351,
  "networkId": 534351,
  "slip44": 1,
  "explorers": [
    {
      "name": "Scroll Sepolia Etherscan",
      "url": "https://sepolia.scrollscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Scroll Sepolia Blockscout",
      "url": "https://sepolia-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://sepolia.scroll.io/bridge"
      }
    ]
  },
  "status": "active"
} satisfies Chain