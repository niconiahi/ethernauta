// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_9003 = {
  name: "Qubetics Alpha Testnet",
  shortName: "QubeticsAlpha",
  chain: "Qubetics Alpha Testnet",
  icon: "qubetics",
  rpc: ["https://alphatestnet-evm-rpc.qubetics.work/"],
  faucets: [
    "https://alphatestnet-explorer.qubetics.work/faucet",
  ],
  nativeCurrency: {
    name: "Qubetics Testnet Token",
    symbol: "TICS",
    decimals: 18,
  },
  infoURL: "https://www.qubetics.com/",
  chainId: 9003,
  networkId: 9003,
  explorers: [
    {
      name: "Qubetics Alpha Testnet Explorer",
      url: "https://alphatestnet-explorer.qubetics.work/dashboard",
      standard: "none",
    },
  ],
} satisfies Chain
