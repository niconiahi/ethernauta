import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_22222: Chain = {
  name: "Nautilus Mainnet",
  shortName: "NAUTCHAIN",
  chain: "ETH",
  icon: "nautilus",
  rpc: [
    "https://api.nautilus.nautchain.xyz",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Zebec",
    symbol: "ZBC",
    decimals: 18,
  },
  infoURL: "https://docs.nautchain.xyz",
  chainId: 22222,
  networkId: 22222,
  explorers: [
    {
      name: "Nautscan",
      url: "https://nautscan.com",
      standard: "EIP3091",
    },
  ],
}
