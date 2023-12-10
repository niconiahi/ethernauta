import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_595: Chain = {
  name: "Acala Mandala Testnet TC9",
  shortName: "maca",
  chain: "mACA",
  rpc: [
    "https://eth-rpc-tc9.aca-staging.network",
    "wss://eth-rpc-tc9.aca-staging.network",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Acala Mandala Token",
    symbol: "mACA",
    decimals: 18,
  },
  infoURL: "https://acala.network",
  chainId: 595,
  networkId: 595,
  slip44: 595,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.mandala.aca-staging.network",
      standard: "EIP3091",
    },
  ],
}
