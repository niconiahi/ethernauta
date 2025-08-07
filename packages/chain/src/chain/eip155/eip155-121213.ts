// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_121213 = {
  name: "Rome Devnet Subura",
  shortName: "rome-devnet-subura",
  chain: "ROME",
  icon: "rome",
  rpc: ["https://subura-i.devnet.romeprotocol.xyz"],
  faucets: ["https://deposit.devnet.romeprotocol.xyz"],
  nativeCurrency: {
    name: "RSOL",
    symbol: "RSOL",
    decimals: 18,
  },
  infoURL: "https://rome.builders",
  chainId: 121213,
  networkId: 121213,
  explorers: [
    {
      name: "Rome Devnet Subura Explorer",
      url: "https://romescout-subura-i.devnet.romeprotocol.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
