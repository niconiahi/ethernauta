import type { Chain } from "../shared"

export const eip155_7773777 = {
  name: "VALYGO NFT",
  shortName: "vyonft",
  chain: "VYO",
  icon: "valygo",
  rpc: [
    "https://rpc-gw-1.vyoscan.com/ext/bc/2RyzsmGypNQZPby1miwMMV8spTvhgd9qd2peNRzU1mErUQqSSw/rpc",
    "https://rpc-gw-2.vyoscan.com/ext/bc/2RyzsmGypNQZPby1miwMMV8spTvhgd9qd2peNRzU1mErUQqSSw/rpc",
  ],
  faucets: [],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "VYO",
    symbol: "VYO",
    decimals: 18,
  },
  infoURL: "https://vyochain.com",
  chainId: 7773777,
  networkId: 7773777,
  explorers: [
    {
      name: "VYOScan NFT",
      url: "https://nft.vyoscan.com",
      standard: "EIP3091",
    },
  ],
  parent: {
    type: "L2",
    chain: "eip155-43114",
    bridges: [],
  },
} satisfies Chain
