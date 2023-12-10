import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_7027: Chain = {
  name: "Ella the heart",
  shortName: "ELLA",
  chain: "ella",
  icon: "ella",
  rpc: [
    "https://rpc.ella.network",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ella",
    symbol: "ELLA",
    decimals: 18,
  },
  infoURL: "https://ella.network",
  chainId: 7027,
  networkId: 7027,
  explorers: [
    {
      name: "Ella",
      url: "https://ella.network",
      standard: "EIP3091",
    },
  ],
}
