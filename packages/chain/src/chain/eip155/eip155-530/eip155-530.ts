/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_530 = {
  "name": "F(x)Core Mainnet Network",
  "shortName": "FxCore",
  "chain": "Fxcore",
  "icon": "fxcore",
  "rpc": [
    "https://fx-json-web3.functionx.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "infoURL": "https://functionx.io/",
  "chainId": 530,
  "networkId": 530,
  "explorers": [
    {
      "name": "FunctionX Explorer",
      "url": "https://fx-evm.functionx.io",
      "standard": "EIP3091"
    }
  ]
} satisfies Chain