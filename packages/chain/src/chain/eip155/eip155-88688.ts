import type { Chain } from "../shared"

export const eip155_88688 = {
  name: "Cycle Network Mainnet Frigate",
  shortName: "cyclef",
  chain: "ETH",
  icon: "cycle",
  rpc: ["https://frigate-rpc-mainnet.cyclenetwork.io"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://www.cyclenetwork.io/",
  chainId: 88688,
  networkId: 88688,
} satisfies Chain
