import type { Chain } from "../shared"

export const eip155_2064 = {
  name: "MFX Network",
  shortName: "mfx",
  chain: "MFX",
  icon: "mfx",
  rpc: ["https://rpc.mfx.network/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "MFX",
    symbol: "MFX",
    decimals: 18,
  },
  infoURL: "https://docs.mfx.network/integration.html",
  chainId: 2064,
  networkId: 2064,
  explorers: [
    {
      name: "MFX Explorer",
      url: "https://explorer.mfx.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
