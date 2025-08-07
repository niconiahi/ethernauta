// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_65010003 = {
  name: "Autonity Bakerloo (Yamuna) Testnet",
  shortName: "bakerloo-03",
  chain: "AUT",
  icon: "autonity",
  rpc: [],
  faucets: ["https://faucet.autonity.org/"],
  nativeCurrency: {
    name: "Bakerloo Auton",
    symbol: "ATN",
    decimals: 18,
  },
  infoURL: "https://autonity.org/",
  chainId: 65010003,
  networkId: 65010003,
  slip44: 1,
  explorers: [
    {
      name: "autonity-blockscout",
      url: "https://bakerloo.autonity.org",
      standard: "EIP3091",
    },
  ],
  status: "deprecated",
} satisfies Chain
