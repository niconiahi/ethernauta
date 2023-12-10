import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_9792: Chain = {
  name: "Carbon EVM Testnet",
  shortName: "carbon-testnet",
  chain: "Carbon",
  icon: "carbon",
  rpc: [
    "https://test-evm-api.carbon.network/",
  ],
  faucets: [],
  nativeCurrency: {
    name: "swth",
    symbol: "SWTH",
    decimals: 18,
  },
  infoURL: "https://carbon.network/",
  chainId: 9792,
  networkId: 9792,
  explorers: [],
}
