import type { Chain } from "../shared"

export const eip155_250210 = {
  name: "PlasticHero",
  shortName: "pth",
  chain: "PTH",
  icon: "plastichero",
  rpc: ["https://rpc.plasticherokorea.com"],
  faucets: [],
  nativeCurrency: {
    name: "PlasticHero",
    symbol: "PTH",
    decimals: 18,
  },
  infoURL: "https://www.plasticherocoin.com",
  chainId: 250210,
  networkId: 250210,
  explorers: [
    {
      name: "PlasticHero Explorer",
      url: "https://explorer.plasticherokorea.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
