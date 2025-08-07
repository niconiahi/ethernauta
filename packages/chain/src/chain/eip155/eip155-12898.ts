// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_12898 = {
  name: "PlayFair Testnet Subnet",
  shortName: "playfair",
  chain: "PLAYFAIR",
  icon: "playfair",
  rpc: [
    "https://rpc.letsplayfair.ai/ext/bc/2hhXFNp1jR4RuqvCmWQnBtt9CZnCmmyGr7TNTkxt7XY7pAzHMY/rpc",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BTLT Token",
    symbol: "BTLT",
    decimals: 18,
  },
  infoURL: "https://letsplayfair.ai",
  chainId: 12898,
  networkId: 12898,
  explorers: [
    {
      name: "Avalanche Subnet Explorer",
      url: "https://subnets-test.avax.network/letsplayfair",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
