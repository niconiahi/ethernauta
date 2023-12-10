import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_201804: Chain = {
  name: "Mythical Chain",
  shortName: "myth",
  chain: "MYTH",
  icon: "mythical",
  rpc: [
    "https://chain-rpc.mythicalgames.com",
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
    name: "Mythos",
    symbol: "MYTH",
    decimals: 18,
  },
  infoURL: "https://mythicalgames.com/",
  chainId: 201804,
  networkId: 201804,
  explorers: [
    {
      name: "Mythical Chain Explorer",
      url: "https://explorer.mythicalgames.com",
      standard: "EIP3091",
    },
  ],
}
