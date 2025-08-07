/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_420420419 = {
  "name": "Asset Hub",
  "shortName": "AH",
  "chain": "DOT",
  "rpc": [
    "https://asset-hub-eth-rpc.polkadot.io"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "DOT",
    "symbol": "DOT",
    "decimals": 18
  },
  "infoURL": "https://polkadot.network",
  "chainId": 420420419,
  "networkId": 420420419,
  "explorers": []
} satisfies Chain