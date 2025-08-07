// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18231 = {
  name: "unreal-old",
  shortName: "unreal-old",
  title: "unreal testnet for re.al",
  chain: "unreal",
  icon: "unreal",
  rpc: [
    "https://rpc.unreal.gelato.digital",
    "wss://ws.unreal.gelato.digital",
  ],
  faucets: [],
  nativeCurrency: {
    name: "unreal Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/unreal",
  chainId: 18231,
  networkId: 18231,
  slip44: 60,
  explorers: [
    {
      name: "blockscout",
      url: "https://unreal.blockscout.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [],
  },
  status: "deprecated",
} satisfies Chain
