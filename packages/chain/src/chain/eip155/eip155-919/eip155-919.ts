import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_919: Chain = {
  name: "Mode Testnet",
  shortName: "modesep",
  chain: "ETH",
  icon: "modeTestnet",
  rpc: [
    "https://sepolia.mode.network",
  ],
  faucets: [
    "https://sepoliafaucet.com/",
  ],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.mode.network/",
  chainId: 919,
  networkId: 919,
  explorers: [
    {
      name: "modescout",
      url: "https://sepolia.explorer.mode.network",
      standard: "none",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://bridge.mode.network/",
      },
    ],
  },
}
