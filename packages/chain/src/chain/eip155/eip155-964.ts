// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_964 = {
  name: "Subtensor EVM",
  shortName: "bittensor-evm-mainnet",
  chain: "Bittensor",
  icon: "bittensor",
  rpc: ["https://lite.chain.opentensor.ai"],
  faucets: [],
  nativeCurrency: {
    name: "TAO",
    symbol: "TAO",
    decimals: 18,
  },
  infoURL: "https://bittensor.com/",
  chainId: 964,
  networkId: 964,
  slip44: 1005,
} satisfies Chain
