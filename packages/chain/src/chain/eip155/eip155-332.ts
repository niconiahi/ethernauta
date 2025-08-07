// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_332 = {
  name: "Omax Testnet",
  shortName: "omaxt",
  chain: "Omax Chain",
  icon: "omaxchain",
  rpc: ["https://testapi.omaxray.com"],
  faucets: ["https://faucet.omaxray.com/"],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "OMAX TESTCOIN",
    symbol: "OMAX",
    decimals: 18,
  },
  infoURL: "https://www.omaxcoin.com/",
  chainId: 332,
  networkId: 332,
  explorers: [
    {
      name: "Omax Chain Explorer",
      url: "https://testnet.omaxscan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
