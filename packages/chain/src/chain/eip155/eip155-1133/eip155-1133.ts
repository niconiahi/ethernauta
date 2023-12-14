/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_1133 = {
  name: "DeFiMetaChain",
  shortName: "changi",
  chain: "DFI",
  icon: "changi",
  rpc: [
    "https://testnet-dmc.mydefichain.com:20551",
  ],
  faucets: [
    "http://tc04.mydefichain.com/faucet",
  ],
  nativeCurrency: {
    name: "DeFiChain Token",
    symbol: "DFI",
    decimals: 18,
  },
  infoURL: "https://defichain.com",
  chainId: 1133,
  networkId: 1133,
  explorers: [
    {
      name: "MetaScan",
      url: "https://meta.defiscan.live",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
