/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../shared"

export const eip155_344106930 = {
  "name": "Deprecated SKALE Calypso Hub Testnet",
  "shortName": "deprected-calypso-testnet",
  "title": "Deprecated Calypso NFT Hub Testnet",
  "chain": "staging-utter-unripe-menkar",
  "icon": "calypso",
  "rpc": [
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "chainId": 344106930,
  "networkId": 344106930,
  "slip44": 1,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "status": "deprecated"
} satisfies Chain