// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2340 = {
  name: "Atleta Olympia",
  shortName: "olym",
  chain: "Atleta Testnet Olympia",
  icon: "atleta",
  rpc: [
    "https://testnet-rpc.atleta.network",
    "https://rpc.ankr.com/atleta_olympia",
    "wss://testnet-rpc.atleta.network",
    "https://atleta-testnet.htw.tech/",
    "https://public-atleta.nownodes.io",
    "https://public-atla-testnet.fastnode.io",
  ],
  faucets: ["https://app-olympia.atleta.network/faucet"],
  nativeCurrency: {
    name: "Atla Olympia",
    symbol: "ATLA",
    decimals: 18,
  },
  infoURL: "https://atleta.network",
  chainId: 2340,
  networkId: 2340,
  slip44: 1,
  explorers: [
    {
      name: "Atleta Olympia Explorer",
      url: "https://blockscout.testnet-v2.atleta.network",
      standard: "none",
    },
    {
      name: "Atleta Olympia Polka Explorer",
      url: "https://polkadot-explorer.atleta.network/#/explorer",
      standard: "none",
    },
  ],
} satisfies Chain
