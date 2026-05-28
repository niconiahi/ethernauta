import type { Chain } from "../shared"

export const eip155_7531 = {
  name: "Rome Palatine",
  shortName: "rome-palatine",
  chain: "ROME",
  icon: "rome",
  rpc: [
    "https://palatine.romeprotocol.xyz",
    "https://palatine2.romeprotocol.xyz",
  ],
  faucets: [],
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
      name: "Rome Palatine Explorer",
      url: "https://romescout-palatine.romeprotocol.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
