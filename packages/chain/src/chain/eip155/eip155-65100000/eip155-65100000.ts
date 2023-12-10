import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_65100000: Chain = {
  name: "Autonity Piccadilly (Thames) Testnet",
  shortName: "piccadilly-0",
  chain: "AUT",
  icon: "autonity",
  rpc: [
    "https://rpc1.piccadilly.autonity.org/",
    "wss://rpc1.piccadilly.autonity.org/ws/",
  ],
  faucets: [
    "https://faucet.autonity.org/",
  ],
  nativeCurrency: {
    name: "Piccadilly Auton",
    symbol: "ATN",
    decimals: 18,
  },
  infoURL: "https://autonity.org/",
  chainId: 65100000,
  networkId: 65100000,
  explorers: [
    {
      name: "autonity-blockscout",
      url: "https://piccadilly.autonity.org",
      standard: "EIP3091",
    },
  ],
}
