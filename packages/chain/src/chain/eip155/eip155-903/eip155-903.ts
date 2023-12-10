import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_903: Chain = {
  name: "Garizon Testnet Stage3",
  shortName: "gar-test-s3",
  chain: "GAR",
  icon: "garizon",
  rpc: [
    "https://s3-testnet.garizon.net/rpc",
  ],
  faucets: [
    "https://faucet-testnet.garizon.com",
  ],
  nativeCurrency: {
    name: "Garizon",
    symbol: "GAR",
    decimals: 18,
  },
  infoURL: "https://garizon.com",
  chainId: 903,
  networkId: 903,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer-testnet.garizon.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "shard",
    chain: "eip155-900",
  },
}
