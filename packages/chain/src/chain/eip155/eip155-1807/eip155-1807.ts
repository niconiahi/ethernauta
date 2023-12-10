import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_1807: Chain = {
  name: "Rabbit Analog Testnet Chain",
  shortName: "rAna",
  chain: "rAna",
  icon: "rabbit",
  rpc: [
    "https://rabbit.analog-rpc.com",
  ],
  faucets: [
    "https://analogfaucet.com",
  ],
  nativeCurrency: {
    name: "Rabbit Analog Test Chain Native Token ",
    symbol: "rAna",
    decimals: 18,
  },
  infoURL: "https://rabbit.analogscan.com",
  chainId: 1807,
  networkId: 1807,
  explorers: [
    {
      name: "blockscout",
      url: "https://rabbit.analogscan.com",
      standard: "none",
    },
  ],
}
