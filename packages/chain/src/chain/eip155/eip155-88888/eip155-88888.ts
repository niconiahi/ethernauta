import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_88888: Chain = {
  name: "IVAR Chain Mainnet",
  shortName: "ivar",
  chain: "IVAR",
  icon: "ivar",
  rpc: [
    "https://mainnet-rpc.ivarex.com",
  ],
  faucets: [
    "https://faucet.ivarex.com/",
  ],
  nativeCurrency: {
    name: "Ivar",
    symbol: "IVAR",
    decimals: 18,
  },
  infoURL: "https://ivarex.com",
  chainId: 88888,
  networkId: 88888,
  explorers: [
    {
      name: "ivarscan",
      url: "https://ivarscan.com",
      standard: "EIP3091",
    },
  ],
}
