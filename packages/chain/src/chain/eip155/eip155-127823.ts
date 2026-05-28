import type { Chain } from "../shared"

export const eip155_127823 = {
  name: "Etherlink Shadownet Testnet",
  shortName: "etlst",
  chain: "Etherlink",
  icon: "etherlink",
  rpc: ["https://node.shadownet.etherlink.com"],
  faucets: ["https://faucet.etherlink.com"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "tez",
    symbol: "XTZ",
    decimals: 18,
  },
  infoURL: "https://etherlink.com",
  chainId: 127823,
  networkId: 127823,
  explorers: [
    {
      name: "Etherlink Shadownet Testnet Explorer",
      url: "https://shadownet.explorer.etherlink.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
