import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1890: Chain = {
  name: "Lightlink Phoenix Mainnet",
  shortName: "lightlink_phoenix",
  chain: "Lightlink Phoenix Mainnet",
  icon: "lightlink",
  rpc: [
    "https://replicator-01.phoenix.lightlink.io/rpc/v1",
    "https://replicator-02.phoenix.lightlink.io/rpc/v1",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://lightlink.io",
  chainId: 1890,
  networkId: 1890,
  explorers: [
    {
      name: "phoenix",
      url: "https://phoenix.lightlink.io",
      standard: "EIP3091",
    },
  ],
}
