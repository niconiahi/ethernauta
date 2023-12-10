import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_13000: Chain = {
  name: "SPS",
  shortName: "SPS",
  chain: "SPS",
  rpc: [
    "https://rpc.ssquad.games",
  ],
  faucets: [],
  nativeCurrency: {
    name: "ECG",
    symbol: "ECG",
    decimals: 18,
  },
  infoURL: "https://ssquad.games/",
  chainId: 13000,
  networkId: 13000,
  explorers: [
    {
      name: "SPS Explorer",
      url: "http://spsscan.ssquad.games",
      standard: "EIP3091",
    },
  ],
}
