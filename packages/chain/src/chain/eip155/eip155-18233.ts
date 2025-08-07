// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_18233 = {
  name: "unreal",
  shortName: "unreal",
  title: "unreal testnet for re.al",
  chain: "unreal",
  icon: "unreal",
  rpc: [
    "https://rpc.unreal-orbit.gelato.digital",
    "wss://ws.unreal-orbit.gelato.digital",
  ],
  faucets: [],
  nativeCurrency: {
    name: "unreal Ether",
    symbol: "reETH",
    decimals: 18,
  },
  infoURL:
    "https://raas.gelato.network/rollups/details/public/unreal",
  chainId: 18233,
  networkId: 18233,
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
    chain: "eip155-17000",
    bridges: [
      {
        url: "https://bridge.gelato.network/bridge/unreal",
      },
    ],
  },
} satisfies Chain
