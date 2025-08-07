// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_2222 = {
  name: "Kava",
  shortName: "kava",
  chain: "KAVA",
  icon: "kava",
  rpc: [
    "https://evm.kava.io",
    "https://kava-rpc.gateway.pokt.network",
    "https://kava-evm.rpc.thirdweb.com",
    "wss://wevm.kava.io",
    "https://kava-evm-rpc.publicnode.com",
    "wss://kava-evm-rpc.publicnode.com",
    "https://evm.kava-rpc.com",
    "https://rpc.ankr.com/kava_evm",
    "wss://wevm.kava-rpc.com",
    "https://kava.drpc.org",
    "wss://kava.drpc.org",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Kava",
    symbol: "KAVA",
    decimals: 18,
  },
  infoURL: "https://www.kava.io",
  chainId: 2222,
  networkId: 2222,
  explorers: [
    {
      name: "Kava EVM Explorer",
      url: "https://kavascan.com",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
