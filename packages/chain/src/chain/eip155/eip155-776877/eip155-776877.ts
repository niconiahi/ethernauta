/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_776877 = {
  "name": "Modularium",
  "shortName": "mdlrm",
  "chain": "EVMCC",
  "rpc": [
    "https://fraa-dancebox-3035-rpc.a.dancebox.tanssi.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Modularium",
    "symbol": "MDM",
    "decimals": 18
  },
  "infoURL": "https://www.rmrk.app/",
  "chainId": 776877,
  "networkId": 776877,
  "explorers": [
    {
      "name": "Tanssi Explorer",
      "url": "https://tanssi-evmexplorer.netlify.app/?rpcUrl=https://fraa-dancebox-3035-rpc.a.dancebox.tanssi.network",
      "standard": "none"
    }
  ]
} satisfies Chain