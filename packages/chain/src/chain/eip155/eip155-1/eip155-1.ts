/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1 = {
  "name": "Ethereum Mainnet",
  "shortName": "eth",
  "chain": "ETH",
  "icon": "ethereum",
  "rpc": [
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    "https://ethereum.publicnode.com",
    "wss://ethereum.publicnode.com",
    "https://mainnet.gateway.tenderly.co",
    "wss://mainnet.gateway.tenderly.co",
    "https://rpc.blocknative.com/boost",
    "https://rpc.flashbots.net",
    "https://rpc.flashbots.net/fast",
    "https://rpc.mevblocker.io",
    "https://rpc.mevblocker.io/fast",
    "https://rpc.mevblocker.io/noreverts",
    "https://rpc.mevblocker.io/fullprivacy"
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://ethereum.org",
  "chainId": 1,
  "networkId": 1,
  "slip44": 60,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://eth.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://ethereum.dex.guru",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain