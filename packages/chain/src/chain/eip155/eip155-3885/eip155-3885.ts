/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_3885 = {
  "name": "Firechain zkEVM Ghostrider",
  "shortName": "firechain-zkEVM-ghostrider",
  "title": "Firechain zkEVM Ghostrider",
  "chain": "Firechain",
  "rpc": [
    "https://rpc.zkevm.ghostrider.thefirechain.com"
  ],
  "faucets": [
    "zkevm-faucet.thefirechain.com"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://docs.thefirechain.com/",
  "chainId": 3885,
  "networkId": 3885,
  "explorers": []
} satisfies Chain