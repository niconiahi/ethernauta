// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_656476 = {
  name: "EDU Chain Testnet",
  shortName: "open-campus-codex",
  chain: "EDU Chain Testnet",
  icon: "open-campus-codex",
  rpc: ["https://rpc.open-campus-codex.gelato.digital"],
  faucets: [],
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/open-campus-codex",
  chainId: 656476,
  networkId: 656476,
  explorers: [
    {
      name: "Open Campus Codex",
      url: "https://edu-chain-testnet.blockscout.com",
      standard: "none",
    },
  ],
} satisfies Chain
