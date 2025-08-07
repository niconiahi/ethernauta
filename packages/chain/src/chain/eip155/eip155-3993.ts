// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_3993 = {
  name: "APEX Testnet",
  shortName: "apexsep",
  chain: "ETH",
  icon: "apextestnet",
  rpc: ["https://rpc-testnet.apexlayer.xyz"],
  faucets: ["https://sepoliafaucet.com/"],
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://docs.apexlayer.xyz/",
  chainId: 3993,
  networkId: 3993,
  slip44: 1,
  explorers: [
    {
      name: "blockscout",
      url: "https://exp-testnet.apexlayer.xyz",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-11155111",
    bridges: [
      {
        url: "https://apexlayer.xyz/bridge",
      },
    ],
  },
} satisfies Chain
