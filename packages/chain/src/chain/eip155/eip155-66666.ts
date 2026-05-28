import type { Chain } from "../shared"

export const eip155_66666 = {
  name: "Bitasset Chain Testnet Ploutos",
  shortName: "bac-ploutos",
  chain: "BAC",
  icon: "bac",
  rpc: ["https://ploutos-rpc.bitassetchain.io"],
  faucets: [],
  nativeCurrency: {
    name: "Bitasset Chain Native Token",
    symbol: "BAC",
    decimals: 18,
  },
  infoURL: "https://bitassetchain.io",
  chainId: 66666,
  networkId: 66666,
  explorers: [
    {
      name: "bacscan-ploutos",
      url: "https://ploutos.bacscan.net",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
