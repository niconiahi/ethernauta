import type { Chain } from "../shared"

export const eip155_1122 = {
  name: "LuxePorts",
  shortName: "lxp",
  chain: "LXP",
  icon: "lxp",
  rpc: [
    "https://rpc.luxeports.com",
    "https://erpc.luxeports.com",
    "wss://rpc.luxeports.com/ws",
    "wss://erpc.luxeports.com/ws",
  ],
  faucets: [],
  nativeCurrency: {
    name: "LuxePorts",
    symbol: "LXP",
    decimals: 18,
  },
  infoURL: "luxeports.com",
  chainId: 1122,
  networkId: 1122,
  explorers: [
    {
      name: "lxpscan",
      url: "https://lxpscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
