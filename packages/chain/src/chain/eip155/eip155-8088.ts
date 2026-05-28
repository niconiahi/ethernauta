import type { Chain } from "../shared"

export const eip155_8088 = {
  name: "Helix Chain",
  shortName: "hlx",
  chain: "HLX",
  icon: "helix",
  rpc: ["https://rpc.thehelixchain.xyz"],
  faucets: ["https://faucet.thehelixchain.xyz"],
  nativeCurrency: {
    name: "Helix",
    symbol: "HLX",
    decimals: 18,
  },
  infoURL: "https://thehelixchain.xyz",
  chainId: 8088,
  networkId: 8088,
  explorers: [
    {
      name: "Helix Chain Explorer",
      url: "https://explorer.thehelixchain.xyz",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
