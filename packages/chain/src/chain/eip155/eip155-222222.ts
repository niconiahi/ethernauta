// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_222222 = {
  name: "Hydration",
  shortName: "hdx",
  chain: "HDX",
  icon: "hydration",
  rpc: [
    "https://rpc.hydradx.cloud",
    "wss://rpc.hydradx.cloud",
    "https://hydration-rpc.n.dwellir.com",
    "wss://hydration-rpc.n.dwellir.com",
    "https://rpc.helikon.io/hydradx",
    "wss://rpc.helikon.io/hydradx",
    "https://hydration.dotters.network",
    "wss://hydration.dotters.network",
    "https://hydration.ibp.network",
    "wss://hydration.ibp.network",
    "https://rpc.cay.hydration.cloud",
    "wss://rpc.cay.hydration.cloud",
    "https://rpc.parm.hydration.cloud",
    "wss://rpc.parm.hydration.cloud",
    "https://rpc.roach.hydration.cloud",
    "wss://rpc.roach.hydration.cloud",
    "https://rpc.zipp.hydration.cloud",
    "wss://rpc.zipp.hydration.cloud",
    "https://rpc.sin.hydration.cloud",
    "wss://rpc.sin.hydration.cloud",
    "https://rpc.coke.hydration.cloud",
    "wss://rpc.coke.hydration.cloud",
  ],
  faucets: [],
  nativeCurrency: {
    name: "Wrapped ETH",
    symbol: "WETH",
    decimals: 18,
  },
  infoURL: "https://hydration.net/",
  chainId: 222222,
  networkId: 222222,
  explorers: [
    {
      name: "blockscout",
      url: "https://explorer.evm.hydration.cloud",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
