// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_336655 = {
  name: "UPchain Testnet",
  shortName: "UPchain-testnet",
  chain: "UPchain",
  icon: "up",
  rpc: ["https://rpc-testnet.uniport.network"],
  faucets: ["https://faucet-testnet.uniport.network"],
  features: [
    {
      name: "EIP155",
    },
  ],
  nativeCurrency: {
    name: "UBTC",
    symbol: "UBTC",
    decimals: 18,
  },
  infoURL: "https://uniport.network",
  chainId: 336655,
  networkId: 336655,
  explorers: [
    {
      name: "UPchain Testnet Explorer",
      url: "https://explorer-testnet.uniport.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
