import type { Chain } from "../shared"

export const eip155_1804 = {
  name: "Kerleano",
  shortName: "kerleano",
  title: "Proof of Climate awaReness testnet",
  chain: "CRC",
  icon: "pocr",
  rpc: [
    "https://rpc1.kerleano.ca-dag.work",
    "https://rpc2.kerleano.ca-dag.work",
    "wss://rpc1.kerleano.ca-dag.work/ws",
    "wss://rpc2.kerleano.ca-dag.work/ws",
  ],
  faucets: [
    "https://github.com/ethereum-pocr/kerleano/blob/main/docs/faucet.md",
  ],
  nativeCurrency: {
    name: "Climate awaReness Coin",
    symbol: "CRC",
    decimals: 18,
  },
  infoURL: "https://github.com/ethereum-pocr/kerleano",
  chainId: 1804,
  networkId: 1804,
  slip44: 1,
  explorers: [
    {
      name: "Lite Explorer",
      url: "https://ethereum-pocr.github.io/explorer/kerleano",
      standard: "EIP3091",
    },
  ],
  status: "active",
} satisfies Chain
