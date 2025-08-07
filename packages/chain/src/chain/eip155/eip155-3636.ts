// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3636 = {
  name: "Botanix Testnet",
  shortName: "BTNXt",
  chain: "BOTANIX",
  icon: "botanix",
  rpc: ["https://node.botanixlabs.dev"],
  faucets: ["https://faucet.botanixlabs.dev"],
  nativeCurrency: {
    name: "Botanix",
    symbol: "BTC",
    decimals: 18,
  },
  infoURL: "https://botanixlabs.xyz",
  chainId: 3636,
  networkId: 3636,
  slip44: 1,
  explorers: [
    {
      name: "Botanix Explorer",
      url: "https://testnet.botanixscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
