import type { Chain } from "../shared"

export const eip155_9030 = {
  name: "Qubetics Mainnet",
  shortName: "QubeticsMainnet",
  chain: "Qubetics Mainnet",
  icon: "qubetics",
  rpc: [
    "https://rpc.qubetics.com",
    "wss://socket-testnet.qubetics.work",
    "https://evm-rpc-arch.qubetics.com",
    "https://evm-ws-arch.qubetics.com",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Qubetics",
    symbol: "TICS",
    decimals: 18,
  },
  infoURL: "https://www.qubetics.com",
  chainId: 9030,
  networkId: 9030,
  explorers: [
    {
      name: "Qubetics Mainnet Explorer",
      url: "https://ticsscan.com",
      standard: "none",
    },
  ],
} satisfies Chain
