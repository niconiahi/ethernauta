import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_78430: Chain = {
  name: "Amplify Subnet",
  shortName: "amplify",
  chain: "AMPLIFY",
  rpc: [
    "https://subnets.avax.network/amplify/testnet/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "AMP",
    symbol: "AMP",
    decimals: 18,
  },
  infoURL: "https://www.avax.network",
  chainId: 78430,
  networkId: 78430,
  explorers: [
    {
      name: "AMPLIFY Explorer",
      url: "https://subnets-test.avax.network/amplify",
      standard: "EIP3091",
    },
  ],
}
