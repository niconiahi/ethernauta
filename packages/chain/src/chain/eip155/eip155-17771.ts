import type { Chain } from "../shared"

export const eip155_17771 = {
  name: "DMD Diamond",
  shortName: "dmd",
  chain: "DMD",
  icon: "dmd",
  rpc: ["https://rpc.bit.diamonds"],
  faucets: ["https://faucet.bit.diamonds"],
  nativeCurrency: {
    name: "DMD",
    symbol: "DMD",
    decimals: 18,
  },
  infoURL: "https://bit.diamonds",
  chainId: 17771,
  networkId: 17771,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.bit.diamonds",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
