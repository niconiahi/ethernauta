import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_94: Chain = {
  name: "SwissDLT",
  shortName: "sdlt",
  chain: "SDLT",
  icon: "bcts",
  rpc: [
    "https://rpc.swissdlt.ch",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BCTS",
    symbol: "BCTS",
    decimals: 18,
  },
  infoURL: "https://bcts.ch",
  chainId: 94,
  networkId: 94,
  explorers: [
    {
      name: "SwissDLT Explorer",
      url: "https://explorer.swissdlt.ch",
      standard: "EIP3091",
    },
  ],
}
