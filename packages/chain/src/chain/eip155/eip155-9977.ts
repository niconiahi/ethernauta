// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9977 = {
  name: "Mind Smart Chain Testnet",
  shortName: "tMIND",
  chain: "tMIND",
  icon: "mindchain",
  rpc: [
    "https://testnet-msc.mindchain.info/",
    "wss://testnet-msc.mindchain.info/ws",
  ],
  faucets: ["https://faucet.mindchain.info/"],
  nativeCurrency: {
    name: "MIND Coin",
    symbol: "tMIND",
    decimals: 18,
  },
  infoURL: "https://mindchain.info",
  chainId: 9977,
  networkId: 9977,
  slip44: 1,
  explorers: [
    {
      name: "Mind Chain explorer",
      url: "https://testnet.mindscan.info",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
