/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_369 = {
  "name": "PulseChain",
  "shortName": "pls",
  "chain": "PLS",
  "rpc": [
    "https://rpc.pulsechain.com",
    "wss://rpc.pulsechain.com",
    "https://pulsechain.publicnode.com",
    "wss://pulsechain.publicnode.com",
    "https://rpc-pulsechain.g4mm4.io",
    "wss://rpc-pulsechain.g4mm4.io"
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
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com/",
  "chainId": 369,
  "networkId": 369,
  "slip44": 60,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.pulsechain.com",
      "standard": "EIP3091"
    },
    {
      "name": "otterscan",
      "url": "https://otter.pulsechain.com",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain