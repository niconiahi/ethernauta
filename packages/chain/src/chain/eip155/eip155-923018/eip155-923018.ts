import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_923018: Chain = {
  name: "FNCY Testnet",
  shortName: "tFNCY",
  chain: "FNCY",
  icon: "fncy",
  rpc: [
    "https://fncy-testnet-seed.fncy.world",
  ],
  faucets: [
    "https://faucet-testnet.fncy.world",
  ],
  nativeCurrency: {
    name: "FNCY",
    symbol: "FNCY",
    decimals: 18,
  },
  infoURL: "https://fncyscan-testnet.fncy.world",
  chainId: 923018,
  networkId: 923018,
  explorers: [
    {
      name: "fncy scan testnet",
      url: "https://fncyscan-testnet.fncy.world",
      standard: "EIP3091",
    },
  ],
}
