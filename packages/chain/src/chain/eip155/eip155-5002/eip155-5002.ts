import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_5002: Chain = {
  name: "Treasurenet Mainnet Alpha",
  shortName: "treasurenet",
  chain: "Treasurenet Mainnet Alpha",
  icon: "treasurenet",
  rpc: [
    "https://node0.treasurenet.io",
    "https://node1.treasurenet.io",
    "https://node2.treasurenet.io",
    "https://node3.treasurenet.io",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "UNIT",
    symbol: "UNIT",
    decimals: 18,
  },
  infoURL: "https://www.treasurenet.io",
  chainId: 5002,
  networkId: 5002,
  explorers: [
    {
      name: "Treasurenet EVM BlockExplorer",
      url: "https://evmexplorer.treasurenet.io",
      standard: "none",
    },
  ],
}
