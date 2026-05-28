import type { Chain } from "../shared"

export const eip155_35147 = {
  name: "CoinAfrica",
  shortName: "coina",
  chain: "CoinAfrica",
  icon: "coina",
  rpc: ["https://rpc.coinafrica.tech"],
  faucets: [],
  nativeCurrency: {
    name: "COINA",
    symbol: "COINA",
    decimals: 18,
  },
  infoURL: "https://coinafrica.tech",
  chainId: 35147,
  networkId: 35147,
  explorers: [
    {
      name: "CoinA-Scan",
      url: "https://coinascan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
