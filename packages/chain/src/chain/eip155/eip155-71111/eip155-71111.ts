import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_71111: Chain = {
  name: "GuapcoinX",
  shortName: "GuapX",
  chain: "GuapcoinX",
  icon: "guapcoinx",
  rpc: [
    "https://rpc-mainnet.guapcoinx.com/",
    "https://rpc-mainnet-1.guapcoinx.com/",
    "https://rpc-mainnet-2.guapcoinx.com/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "GuapcoinX",
    symbol: "GuapX",
    decimals: 18,
  },
  infoURL: "https://guapcoin.org/",
  chainId: 71111,
  networkId: 71111,
  explorers: [
    {
      name: "GuapcoinX Explorer",
      url: "http://explorer.guapcoinx.com",
      standard: "none",
    },
  ],
}
