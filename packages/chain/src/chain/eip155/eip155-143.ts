import type { Chain } from "../shared"

export const eip155_143 = {
  name: "Monad",
  shortName: "mon",
  chain: "MON",
  icon: "monad",
  rpc: ["https://rpc.monad.xyz"],
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
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  infoURL: "https://monad.xyz",
  chainId: 143,
  networkId: 143,
  slip44: 268435779,
  explorers: [
    {
      name: "Monad Vision",
      url: "https://monadvision.com",
      standard: "EIP3091",
    },
    {
      name: "Monadscan",
      url: "https://monadscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
