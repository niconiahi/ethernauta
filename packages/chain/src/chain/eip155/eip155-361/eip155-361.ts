import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_361: Chain = {
  name: "Theta Mainnet",
  shortName: "theta-mainnet",
  chain: "Theta",
  rpc: [
    "https://eth-rpc-api.thetatoken.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Theta Fuel",
    symbol: "TFUEL",
    decimals: 18,
  },
  infoURL: "https://www.thetatoken.org/",
  chainId: 361,
  networkId: 361,
  explorers: [
    {
      name: "Theta Mainnet Explorer",
      url: "https://explorer.thetatoken.org",
      standard: "EIP3091",
    },
  ],
}
