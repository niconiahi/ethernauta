// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_50 = {
  name: "XDC Network",
  shortName: "xdc",
  chain: "XDC",
  icon: "xdc",
  rpc: [
    "https://erpc.xinfin.network",
    "https://rpc.xinfin.network",
    "https://rpc1.xinfin.network",
    "https://rpc.xdcrpc.com",
    "https://erpc.xdcrpc.com",
    "https://rpc.ankr.com/xdc",
    "https://rpc.xdc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "XinFin",
    symbol: "XDC",
    decimals: 18,
  },
  infoURL: "https://xinfin.org",
  chainId: 50,
  networkId: 50,
  explorers: [
    {
      name: "xdcscan",
      url: "https://xdcscan.com",
      standard: "EIP3091",
    },
    {
      name: "openscan",
      url: "https://xdcscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
