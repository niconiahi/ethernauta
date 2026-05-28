import type { Chain } from "../shared"

export const eip155_46634 = {
  name: "Gnodi Mainnet",
  shortName: "gnodi",
  chain: "GNODI",
  icon: "gnodi",
  rpc: ["https://evm.rpc.gnodi.zone"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Gnodi",
    symbol: "GNOD",
    decimals: 18,
  },
  infoURL: "https://gnodi.info",
  chainId: 46634,
  networkId: 46634,
  explorers: [
    {
      name: "gnodiscan",
      url: "https://evm.gnodiscanner.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
