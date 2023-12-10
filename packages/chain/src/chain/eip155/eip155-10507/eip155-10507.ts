import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_10507: Chain = {
  name: "Numbers Mainnet",
  shortName: "Jade",
  chain: "NUM",
  icon: "num",
  rpc: [
    "https://mainnetrpc.num.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "NUM Token",
    symbol: "NUM",
    decimals: 18,
  },
  infoURL: "https://numbersprotocol.io",
  chainId: 10507,
  networkId: 10507,
  explorers: [
    {
      name: "ethernal",
      url: "https://mainnet.num.network",
      standard: "EIP3091",
    },
  ],
}
