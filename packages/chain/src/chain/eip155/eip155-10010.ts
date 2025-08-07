// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_10010 = {
  name: "Warden Testnet",
  shortName: "ward",
  chain: "WARD",
  icon: "warden",
  rpc: [
    "https://evm.chiado.wardenprotocol.org",
    "wss://evm-ws.chiado.wardenprotocol.org",
  ],
  faucets: ["https://faucet.chiado.wardenprotocol.org"],
  nativeCurrency: {
    name: "WARD",
    symbol: "WARD",
    decimals: 18,
  },
  infoURL: "https://wardenprotocol.org",
  chainId: 10010,
  networkId: 10010,
} satisfies Chain
