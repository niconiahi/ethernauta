import type { Chain } from "../shared"

export const eip155_65100004 = {
  name: "Autonity Piccadilly (Tiber) Testnet",
  shortName: "piccadilly-04",
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
  chainId: 65100004,
  networkId: 65100004,
  slip44: 1,
  explorers: [],
  status: "deprecated",
} satisfies Chain
