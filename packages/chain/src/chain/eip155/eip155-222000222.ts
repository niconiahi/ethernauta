// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_222000222 = {
  name: "Kanazawa",
  shortName: "kanazawa",
  title: "Meld Testnet Kanazawa",
  chain: "Kanazawa",
  icon: "meld",
  rpc: ["https://testnet-rpc.meld.com"],
  faucets: [],
  features: [],
  nativeCurrency: {
    name: "gMeld",
    symbol: "gMELD",
    decimals: 18,
  },
  infoURL: "https://meld.com",
  chainId: 222000222,
  networkId: 222000222,
  slip44: 1,
  explorers: [
    {
      name: "explorer",
      url: "https://testnet.meldscan.io",
      standard: "EIP3091",
    },
    {
      name: "explorer",
      url: "https://subnets-test.avax.network/meld",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
