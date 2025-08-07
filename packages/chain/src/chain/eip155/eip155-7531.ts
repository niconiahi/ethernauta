// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7531 = {
  name: "Rome Mainnet 0 Palatine",
  shortName: "rome-mainnet-0-palatine",
  chain: "ROME",
  icon: "rome",
  rpc: ["https://palatine-i.mainnet-0.romeprotocol.xyz"],
  faucets: ["https://deposit.mainnet-0.romeprotocol.xyz"],
  nativeCurrency: {
    name: "RSOL",
    symbol: "RSOL",
    decimals: 18,
  },
  infoURL: "https://rome.builders",
  chainId: 7531,
  networkId: 7531,
  explorers: [
    {
      name: "Rome Mainnet 0 Palatine Explorer",
      url: "https://romescout-palatine-i.mainnet-0.romeprotocol.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
