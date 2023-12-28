/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_943 = {
  "name": "PulseChain Testnet v4",
  "shortName": "t4pls",
  "chain": "t4PLS",
  "icon": "pulsechain",
  "rpc": [
    "https://rpc.v4.testnet.pulsechain.com",
    "wss://rpc.v4.testnet.pulsechain.com",
    "https://pulsechain-testnet.publicnode.com",
    "wss://pulsechain-testnet.publicnode.com",
    "https://rpc-testnet-pulsechain.g4mm4.io",
    "wss://rpc-testnet-pulsechain.g4mm4.io"
  ],
  "faucets": [
    "https://faucet.v4.testnet.pulsechain.com/"
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
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com",
  "chainId": 943,
  "networkId": 943,
  "slip44": 1,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.v4.testnet.pulsechain.com",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://otter-testnet-pulsechain.g4mm4.io",
      "standard": "EIP3091"
    }
  ],
  "status": "active"
} satisfies Chain