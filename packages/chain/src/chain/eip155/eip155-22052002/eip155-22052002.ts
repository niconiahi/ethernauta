import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_22052002: Chain = {
  name: "Excelon Mainnet",
  shortName: "xlon",
  chain: "XLON",
  icon: "xlon",
  rpc: [
    "https://edgewallet1.xlon.org/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Excelon",
    symbol: "xlon",
    decimals: 18,
  },
  infoURL: "https://xlon.org",
  chainId: 22052002,
  networkId: 22052002,
  explorers: [
    {
      name: "Excelon explorer",
      url: "https://explorer.excelon.io",
      standard: "EIP3091",
    },
  ],
}
