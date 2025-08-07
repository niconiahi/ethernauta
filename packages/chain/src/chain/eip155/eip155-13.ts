// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_13 = {
  name: "Diode Testnet Staging",
  shortName: "dstg",
  chain: "DIODE",
  rpc: [
    "https://staging.diode.io:8443/",
    "wss://staging.diode.io:8443/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Staging Diodes",
    symbol: "sDIODE",
    decimals: 18,
  },
  infoURL: "https://diode.io/staging",
  chainId: 13,
  networkId: 13,
  slip44: 1,
} satisfies Chain
