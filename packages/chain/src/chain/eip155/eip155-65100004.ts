// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_65100004 = {
  name: "Autonity Piccadilly (Tiber) Testnet",
  shortName: "piccadilly-04",
  chain: "AUT",
  icon: "autonity",
  rpc: [
    "https://autonity.rpc.web3cdn.network/testnet",
    "wss://autonity.rpc.web3cdn.network/testnet/ws",
    "https://autonity-piccadilly.rpc.subquery.network/public",
    "https://piccadilly.autonity-apis.com",
    "wss://piccadilly-ws.autonity-apis.com",
  ],
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
  explorers: [
    {
      name: "autonity-blockscout",
      url: "https://piccadilly.autonity.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
