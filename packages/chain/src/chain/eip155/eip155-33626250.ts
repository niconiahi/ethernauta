/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_33626250 = {
  "name": "Toliman Suave Testnet",
  "shortName": "suave-toliman",
  "chain": "ETH",
  "rpc": [
    "https://rpc.toliman.suave.flashbots.net"
  ],
  "faucets": [
    "https://faucet.toliman.suave.flashbots.net"
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
    "name": "SUAVE Toliman Eth",
    "symbol": "TEEth",
    "decimals": 18
  },
  "infoURL": "https://suave-alpha.flashbots.net/toliman",
  "chainId": 33626250,
  "networkId": 33626250,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.toliman.suave.flashbots.net",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain