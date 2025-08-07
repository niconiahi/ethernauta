// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_198989 = {
  name: "Lydia Coin Testnet",
  shortName: "lydia-testnet",
  chain: "LYDIA-TESTNET",
  rpc: ["https://testnet-rpc.lydiacoins.com"],
  faucets: ["https://faucet.lydiacoins.com/"],
  nativeCurrency: {
    name: "Lydia Token",
    symbol: "BSW",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/lydia-coin-testnet",
  chainId: 198989,
  networkId: 198989,
} satisfies Chain
