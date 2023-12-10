import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3331: Chain = {
  name: "ZCore Testnet",
  shortName: "zcrbeach",
  chain: "Beach",
  icon: "zcore",
  rpc: [
    "https://rpc-testnet.zcore.cash",
  ],
  faucets: [
    "https://faucet.zcore.cash",
  ],
  nativeCurrency: {
    name: "ZCore",
    symbol: "ZCR",
    decimals: 18,
  },
  infoURL: "https://zcore.cash",
  chainId: 3331,
  networkId: 3331,
}
