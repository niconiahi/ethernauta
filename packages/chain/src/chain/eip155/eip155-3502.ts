// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3502 = {
  name: "JFINPOS",
  shortName: "jzero",
  chain: "JFINPOS",
  icon: "jfinpos",
  rpc: ["https://rpc.jfinpos.com"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "JFINPOS",
    symbol: "JPOS",
    decimals: 18,
  },
  infoURL: "https://jfinpos.com",
  chainId: 3502,
  networkId: 3502,
  explorers: [
    {
      name: "JFINPOS Explorer",
      url: "https://exp.jfinpos.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
