import type { Chain } from "../shared"

export const eip155_1650 = {
  name: "IIC Blockchain Testnet",
  shortName: "iic-testnet",
  chain: "IIC",
  rpc: ["https://rpc.iic-blockchain.com"],
  faucets: [],
  nativeCurrency: {
    name: "Saya Coin",
    symbol: "SAYA",
    decimals: 18,
  },
  infoURL: "https://metavtz.com/",
  chainId: 1650,
  networkId: 1650,
  explorers: [
    {
      name: "IIC Explorer",
      url: "https://scan.iic-blockchain.com",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
