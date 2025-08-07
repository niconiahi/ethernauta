// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_65100003 = {
  name: "Autonity Piccadilly (Yamuna) Testnet",
  shortName: "piccadilly-03",
  chain: "AUT",
  icon: "autonity",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "Piccadilly Auton",
    symbol: "ATN",
    decimals: 18,
  },
  infoURL: "https://autonity.org/",
  chainId: 65100003,
  networkId: 65100003,
  slip44: 1,
  explorers: [
    {
      name: "autonity-blockscout",
      url: "https://piccadilly.autonity.org",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
