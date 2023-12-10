import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_10101010: Chain = {
  name: "Soverun Mainnet",
  shortName: "SVRNm",
  chain: "SVRN",
  icon: "soverun",
  rpc: [
    "https://mainnet-rpc.soverun.com",
  ],
  faucets: [
    "https://faucet.soverun.com",
  ],
  nativeCurrency: {
    name: "Soverun",
    symbol: "SVRN",
    decimals: 18,
  },
  infoURL: "https://soverun.com",
  chainId: 10101010,
  networkId: 10101010,
  explorers: [
    {
      name: "Soverun",
      url: "https://explorer.soverun.com",
      standard: "EIP3091",
    },
  ],
}
