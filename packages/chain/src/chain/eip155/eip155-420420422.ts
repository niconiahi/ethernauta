/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_420420422 = {
  "name": "Paseo PassetHub",
  "shortName": "pas",
  "chain": "PAS",
  "rpc": [
    "https://testnet-passet-hub-eth-rpc.polkadot.io"
  ],
  "faucets": [
    "https://faucet.polkadot.io/?parachain=1111"
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
    "name": "PAS",
    "symbol": "PAS",
    "decimals": 18
  },
  "infoURL": "https://polkadot.network",
  "chainId": 420420422,
  "networkId": 420420422
} satisfies Chain