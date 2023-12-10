import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1891: Chain = {
  name: "Lightlink Pegasus Testnet",
  shortName: "lightlink_pegasus",
  chain: "Lightlink Pegasus Testnet",
  icon: "lightlink",
  rpc: [
    "https://replicator-01.pegasus.lightlink.io/rpc/v1",
    "https://replicator-02.pegasus.lightlink.io/rpc/v1",
  ],
  faucets: [
    "https://pegasus-faucet-react.vercel.app",
  ],
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
  chainId: 1891,
  networkId: 1891,
  explorers: [
    {
      name: "pegasus",
      url: "https://pegasus.lightlink.io",
      standard: "EIP3091",
    },
  ],
}
