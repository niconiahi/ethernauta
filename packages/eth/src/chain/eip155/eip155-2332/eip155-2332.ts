/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_2332 = {
  "name": "SOMA Network Mainnet",
  "shortName": "smam",
  "chain": "SOMA",
  "icon": "soma",
  "rpc": [
    "https://data-mainnet-v1.somanetwork.io/",
    "https://id-mainnet.somanetwork.io",
    "https://hk-mainnet.somanetwork.io",
    "https://sg-mainnet.somanetwork.io"
  ],
  "faucets": [
    "https://airdrop.somanetwork.io"
  ],
  "nativeCurrency": {
    "name": "Soma Native Token",
    "symbol": "SMA",
    "decimals": 18
  },
  "infoURL": "https://somanetwork.io",
  "chainId": 2332,
  "networkId": 2332,
  "explorers": [
    {
      "name": "SOMA Explorer Mainnet",
      "url": "https://somascan.io",
      "standard": "none"
    }
  ],
  "status": "incubating"
} satisfies Chain