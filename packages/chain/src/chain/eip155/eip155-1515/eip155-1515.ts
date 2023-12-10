import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1515: Chain = {
  name: "Beagle Messaging Chain",
  shortName: "beagle",
  chain: "BMC",
  rpc: [
    "https://beagle.chat/eth",
  ],
  faucets: [
    "https://faucet.beagle.chat/",
  ],
  nativeCurrency: {
    name: "Beagle",
    symbol: "BG",
    decimals: 18,
  },
  infoURL: "https://beagle.chat/",
  chainId: 1515,
  networkId: 1515,
  explorers: [
    {
      name: "Beagle Messaging Chain Explorer",
      url: "https://eth.beagle.chat",
      standard: "EIP3091",
    },
  ],
}
