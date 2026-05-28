import type { Chain } from "../shared"

export const eip155_6940 = {
  name: "Monolythium Testnet",
  shortName: "lyth-testnet",
  chain: "LYTH",
  icon: "monolythium",
  rpc: ["https://evm.testnet.mononodes.xyz"],
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
  chainId: 6940,
  networkId: 6940,
  slip44: 1,
  explorers: [
    {
      name: "Monoscan",
      url: "https://testnet.monoscan.xyz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
