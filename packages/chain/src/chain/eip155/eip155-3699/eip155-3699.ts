import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_3699: Chain = {
  name: "SenjePowers Mainnet",
  shortName: "SPCm",
  chain: "SPC",
  icon: "SenjePowers",
  rpc: [
    "https://rpc.senjepowersscan.com",
  ],
  faucets: [
    "https://faucet.senjepowersscan.com",
  ],
  nativeCurrency: {
    name: "SenjePowers",
    symbol: "SPC",
    decimals: 18,
  },
  infoURL: "https://senjepowersscan.com",
  chainId: 3699,
  networkId: 3699,
  explorers: [
    {
      name: "SenjePowers",
      url: "https://senjepowersscan.com",
      standard: "EIP3091",
    },
  ],
}
