import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2625: Chain = {
  name: "WhiteBIT Network Testnet",
  shortName: "twbt",
  chain: "WBT",
  icon: "whitebit-testnet",
  rpc: [
    "https://rpc-testnet.whitebit.network",
  ],
  faucets: [
    "https://explorer.whitebit.network/testnet/faucet",
  ],
  nativeCurrency: {
    name: "WhiteBIT Coin",
    symbol: "WBT",
    decimals: 18,
  },
  infoURL: "https://whitebit.com/wbt",
  chainId: 2625,
  networkId: 2625,
  explorers: [
    {
      name: "wb-explorer-testnet",
      url: "https://explorer.whitebit.network/testnet",
      standard: "EIP3091",
    },
  ],
}
