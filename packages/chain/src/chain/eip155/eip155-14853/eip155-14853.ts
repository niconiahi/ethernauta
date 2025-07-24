/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_14853 = {
  "name": "Humanode Testnet 5 Israfel",
  "shortName": "hmnd-t5",
  "chain": "Humanode Testnet 5",
  "icon": "humanode",
  "rpc": [
    "https://explorer-rpc-http.testnet5.stages.humanode.io"
  ],
  "faucets": [
    "https://t.me/HumanodeTestnet5FaucetBot"
  ],
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "chainId": 14853,
  "networkId": 14853,
  "slip44": 1,
  "explorers": []
} satisfies Chain