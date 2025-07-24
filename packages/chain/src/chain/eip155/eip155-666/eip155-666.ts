/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_666 = {
  "name": "Pixie Chain Testnet",
  "shortName": "pixie-chain-testnet",
  "chain": "PixieChain",
  "rpc": [
    "https://http-testnet.chain.pixie.xyz",
    "wss://ws-testnet.chain.pixie.xyz"
  ],
  "faucets": [
    "https://chain.pixie.xyz/faucet"
  ],
  "nativeCurrency": {
    "name": "Pixie Chain Testnet Native Token",
    "symbol": "PCTT",
    "decimals": 18
  },
  "infoURL": "https://scan-testnet.chain.pixie.xyz",
  "chainId": 666,
  "networkId": 666,
  "slip44": 1
} satisfies Chain