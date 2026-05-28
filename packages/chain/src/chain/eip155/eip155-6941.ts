import type { Chain } from "../shared"

export const eip155_6941 = {
  name: "Monolythium",
  shortName: "lyth",
  chain: "LYTH",
  icon: "monolythium",
  rpc: ["https://evm.mainnet.mononodes.xyz"],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Lythium",
    symbol: "LYTH",
    decimals: 18,
  },
  infoURL: "https://monolythium.com",
  chainId: 6941,
  networkId: 6941,
  slip44: 60,
  explorers: [
    {
      name: "Monoscan",
      url: "https://monoscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
