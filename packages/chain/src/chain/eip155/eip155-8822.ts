// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_8822 = {
  name: "IOTA EVM",
  shortName: "iotaevm",
  title: "IOTA EVM",
  chain: "IOTA EVM",
  icon: "iotaevm",
  rpc: [
    "https://json-rpc.evm.iotaledger.net",
    "wss://ws.json-rpc.evm.iotaledger.net",
  ],
  faucets: [],
  nativeCurrency: {
    name: "IOTA",
    symbol: "IOTA",
    decimals: 18,
  },
  infoURL: "https://www.iota.org",
  chainId: 8822,
  networkId: 8822,
  explorers: [
    {
      name: "explorer",
      url: "https://explorer.evm.iota.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
