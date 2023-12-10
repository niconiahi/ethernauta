import type { Chain } from "../../shared"

/* eslint no-template-curly-in-string: 0 */
export const eip155_78281: Chain = {
  name: "Dragonfly Mainnet (Hexapod)",
  shortName: "dfly",
  chain: "Dragonfly",
  icon: "dragonfly",
  rpc: [
    "https://dragonfly-rpc.switch.ch",
    "https://dragonfly-rpc.kore-technologies.ch",
    "https://dragonfly-rpc.phoenix-systems.io",
    "https://dragonfly-rpc.block-spirit.ch",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Dragonfly",
    symbol: "DFLY",
    decimals: 18,
  },
  infoURL: "https://hexapod.network",
  chainId: 78281,
  networkId: 78281,
  explorers: [
    {
      name: "Dragonfly Blockscout",
      url: "https://blockscout.dragonfly.hexapod.network",
      standard: "EIP3091",
    },
  ],
}
