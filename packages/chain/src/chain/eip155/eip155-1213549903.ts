import type { Chain } from "../shared"

export const eip155_1213549903 = {
  name: "Mirasmanda",
  shortName: "mirasmanda",
  chain: "MIRASMANDA",
  icon: "mirasmanda",
  rpc: ["https://rpc.evm.mirasmanda.uz"],
  faucets: ["https://faucet.evm.mirasmanda.uz"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "Gas",
    symbol: "GAS",
    decimals: 18,
  },
  infoURL: "https://asterium.uz/",
  chainId: 1213549903,
  networkId: 1213549903,
  explorers: [
    {
      name: "blockscout",
      url: "https://blockscout.evm.mirasmanda.uz",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
