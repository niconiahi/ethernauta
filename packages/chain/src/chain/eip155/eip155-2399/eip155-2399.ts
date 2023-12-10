import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_2399: Chain = {
  name: "BOMB Chain Testnet",
  shortName: "bombt",
  chain: "BOMB",
  icon: "bomb",
  rpc: [
    "https://bombchain-testnet.ankr.com/bas_full_rpc_1",
  ],
  faucets: [
    "https://faucet.bombchain-testnet.ankr.com/",
  ],
  nativeCurrency: {
    name: "BOMB Token",
    symbol: "tBOMB",
    decimals: 18,
  },
  infoURL: "https://www.bombmoney.com",
  chainId: 2399,
  networkId: 2399,
  explorers: [
    {
      name: "bombscan-testnet",
      url: "https://explorer.bombchain-testnet.ankr.com",
      standard: "EIP3091",
    },
  ],
}
