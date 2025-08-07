// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_7171 = {
  name: "Bitrock Mainnet",
  shortName: "bitrock",
  chain: "Bitrock",
  icon: "bitrock",
  rpc: [
    "https://connect.bit-rock.io",
    "https://brockrpc.io",
  ],
  faucets: [],
  nativeCurrency: {
    name: "BITROCK",
    symbol: "BROCK",
    decimals: 18,
  },
  infoURL: "https://bit-rock.io",
  chainId: 7171,
  networkId: 7171,
  explorers: [
    {
      name: "Bitrock Explorer",
      url: "https://brockscan.io",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
