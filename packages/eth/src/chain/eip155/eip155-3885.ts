/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_3885 = {
  "name": "Firechain zkEVM Ghostrider",
  "shortName": "firechain-zkEVM-testnet",
  "title": "Firechain zkEVM Testnet",
  "chain": "Firechain",
  "icon": "ethereum",
  "rpc": [
    "https://rpc-zkevm-ghostrider.thefirechain.com",
    "https://rpc-zkevm-ghostrider.firestation.io"
  ],
  "faucets": [
    "zkevm-faucet.thefirechain.com",
    "https://zkevm-faucet.firestation.io"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.thefirechain.com/",
  "chainId": 3885,
  "networkId": 3885,
  "explorers": [
    {
      "name": "FireScan",
      "url": "https://ghostrider-zkevm.firescan.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain