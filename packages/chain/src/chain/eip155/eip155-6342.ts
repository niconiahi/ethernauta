import type { Chain } from "../shared"

export const eip155_6342 = {
  name: "MegaETH Testnet (Deprecated)",
  shortName: "megatest-deprecated",
  chain: "ETH",
  rpc: [],
  faucets: [],
  nativeCurrency: {
    name: "MegaETH Testnet Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://testnet.megaeth.com",
  chainId: 6342,
  networkId: 6342,
  slip44: 1,
  status: "deprecated",
} satisfies Chain
