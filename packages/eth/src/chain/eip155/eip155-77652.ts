/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_77652 = {
  "name": "Carrchain Testnet",
  "shortName": "Carrchain-Testnet",
  "chain": "Carrchain Testnet",
  "rpc": [
    "https://rpc-testnetcarrchain.artiffine.com"
  ],
  "faucets": [
    "https://faucet-testnetcarrchain.artiffine.com"
  ],
  "nativeCurrency": {
    "name": "Carrchain Coin",
    "symbol": "CARR",
    "decimals": 18
  },
  "infoURL": "https://explorer-testnetcarrchain.artiffine.com",
  "chainId": 77652,
  "networkId": 77652,
  "explorers": [
    {
      "name": "tracehawk",
      "url": "https://explorer-testnetcarrchain.artiffine.com",
      "standard": "none"
    }
  ]
} satisfies Chain