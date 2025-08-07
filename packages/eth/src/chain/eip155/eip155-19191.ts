/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_19191 = {
  "name": "BlockX Mainnet",
  "shortName": "bcx",
  "chain": "blockx",
  "rpc": [
    "https://web3.blockxnet.com"
  ],
  "faucets": [
    "https://ping.blockxnet.com/blockx/faucet"
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
    "name": "BCX",
    "symbol": "BCX",
    "decimals": 18
  },
  "infoURL": "https://www.blockxnet.com/",
  "chainId": 19191,
  "networkId": 19191,
  "explorers": [
    {
      "name": "BlockX EVM Explorer (Blockscout)",
      "url": "https://explorer.blockxnet.com",
      "standard": "EIP3091"
    },
    {
      "name": "BlockX Cosmos Explorer (Ping)",
      "url": "https://ping.blockxnet.com/blockx",
      "standard": "none"
    }
  ]
} satisfies Chain