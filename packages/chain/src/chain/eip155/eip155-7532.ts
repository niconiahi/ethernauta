// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7532 = {
  name: "Rome Mainnet 0 Aventine",
  shortName: "rome-mainnet-0-aventine",
  chain: "ROME",
  icon: "rome",
  rpc: ["https://aventine-i.mainnet-0.romeprotocol.xyz"],
  faucets: ["https://deposit.mainnet-0.romeprotocol.xyz"],
  nativeCurrency: {
    name: "RSOL",
    symbol: "RSOL",
    decimals: 18,
  },
  infoURL: "https://rome.builders",
  chainId: 7532,
  networkId: 7532,
  explorers: [
    {
      name: "Rome Mainnet 0 Aventine Explorer",
      url: "https://romescout-aventine-i.mainnet-0.romeprotocol.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
