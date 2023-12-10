import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_365: Chain = {
  name: "Theta Testnet",
  shortName: "theta-testnet",
  chain: "Theta",
  rpc: [
    "https://eth-rpc-api-testnet.thetatoken.org/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Theta Fuel",
    symbol: "TFUEL",
    decimals: 18,
  },
  infoURL: "https://www.thetatoken.org/",
  chainId: 365,
  networkId: 365,
  explorers: [
    {
      name: "Theta Testnet Explorer",
      url: "https://testnet-explorer.thetatoken.org",
      standard: "EIP3091",
    },
  ],
}
