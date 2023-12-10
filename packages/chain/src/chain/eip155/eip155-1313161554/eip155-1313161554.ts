import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1313161554: Chain = {
  name: "Aurora Mainnet",
  shortName: "aurora",
  chain: "NEAR",
  rpc: [
    "https://mainnet.aurora.dev",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://aurora.dev",
  chainId: 1313161554,
  networkId: 1313161554,
  explorers: [
    {
      name: "aurorascan.dev",
      url: "https://aurorascan.dev",
      standard: "EIP3091",
    },
  ],
}
