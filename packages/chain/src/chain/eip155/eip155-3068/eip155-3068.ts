import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3068: Chain = {
  name: "Bifrost Mainnet",
  shortName: "bfc",
  title: "Bifrost Network Mainnet",
  chain: "BFC",
  icon: "bifrost",
  rpc: [
    "https://public-01.mainnet.thebifrost.io/rpc",
    "https://public-02.mainnet.thebifrost.io/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Bifrost",
    symbol: "BFC",
    decimals: 18,
  },
  infoURL: "https://thebifrost.io",
  chainId: 3068,
  networkId: 3068,
  explorers: [
    {
      name: "explorer-thebifrost",
      url: "https://explorer.mainnet.thebifrost.io",
      standard: "EIP3091",
    },
  ],
}
