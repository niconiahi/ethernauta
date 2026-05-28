import type { Chain } from "../shared"

export const eip155_3939 = {
  name: "DOS Testnet",
  shortName: "dos-test",
  chain: "DOS",
  icon: "doschain",
  rpc: ["https://test.doschain.com"],
  faucets: [],
  features: [
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "DOS",
    symbol: "DOS",
    decimals: 18,
  },
  infoURL: "https://doschain.com",
  chainId: 3939,
  networkId: 3939,
  slip44: 1,
  explorers: [
    {
      name: "DOScan-Test",
      url: "https://test.doscan.io",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
