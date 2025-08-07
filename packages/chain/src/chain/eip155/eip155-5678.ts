// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_5678 = {
  name: "Tanssi Demo",
  shortName: "tango",
  chain: "TANGO",
  rpc: [
    "https://dancelight-2001.tanssi-api.network",
    "wss://dancelight-2001.tanssi-api.network",
  ],
  faucets: ["https://apps.tanssi.network/demo"],
  nativeCurrency: {
    name: "TANGO",
    symbol: "TANGO",
    decimals: 18,
  },
  infoURL:
    "https://docs.tanssi.network/builders/tanssi-network/networks/dancebox/demo-evm-containerchain",
  chainId: 5678,
  networkId: 5678,
  explorers: [
    {
      name: "BlockScout",
      url: "https://dancelight-2001-blockscout.tanssi-chains.network",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
