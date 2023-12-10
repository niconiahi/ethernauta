import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_78431: Chain = {
  name: "Bulletin Subnet",
  shortName: "bulletin",
  chain: "BULLETIN",
  rpc: [
    "https://subnets.avax.network/bulletin/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "BLT",
    symbol: "BLT",
    decimals: 18,
  },
  infoURL: "https://www.avax.network",
  chainId: 78431,
  networkId: 78431,
  explorers: [
    {
      name: "BULLETIN Explorer",
      url: "https://subnets-test.avax.network/bulletin",
      standard: "EIP3091",
    },
  ],
}
