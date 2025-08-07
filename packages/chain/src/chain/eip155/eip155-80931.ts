// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_80931 = {
  name: "Forta Chain",
  shortName: "forta",
  chain: "Forta Chain",
  icon: "forta-chain",
  rpc: ["https://rpc-forta-chain-8gj1qndmfc.t.conduit.xyz"],
  faucets: [],
  nativeCurrency: {
    name: "FORT",
    symbol: "FORT",
    decimals: 18,
  },
  infoURL: "https://www.forta.org/",
  chainId: 80931,
  networkId: 80931,
  explorers: [
    {
      name: "Forta Chain Explorer",
      url: "https://explorer.forta.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
