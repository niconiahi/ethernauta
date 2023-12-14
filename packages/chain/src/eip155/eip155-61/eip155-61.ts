/* eslint no-template-curly-in-string: 0 */
import type { Chain } from "../../shared"

export const eip155_61 = {
  name: "Ethereum Classic Mainnet",
  shortName: "etc",
  chain: "ETC",
  icon: "ethereumclassic",
  rpc: [
    "https://etc.rivet.link",
    "https://etc.etcdesktop.com",
    "https://etc.mytokenpocket.vip",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Ethereum Classic Ether",
    symbol: "ETC",
    decimals: 18,
  },
  infoURL: "https://ethereumclassic.org",
  chainId: 61,
  networkId: 1,
  slip44: 61,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.com/etc/mainnet",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
