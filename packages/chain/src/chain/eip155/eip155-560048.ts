// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_560048 = {
  name: "Ethereum Hoodi",
  shortName: "hoe",
  title: "Ethereum Testnet Hoodi",
  chain: "ETH",
  icon: "ethereum",
  rpc: ["https://rpc.hoodi.ethpandaops.io"],
  faucets: [
    "https://faucet.hoodi.ethpandaops.io",
    "https://hoodi-faucet.pk910.de/",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  nativeCurrency: {
    name: "Hoodi Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://hoodi.ethpandaops.io",
  chainId: 560048,
  networkId: 560048,
  slip44: 1,
  explorers: [
    {
      name: "dora",
      url: "https://light-hoodi.beaconcha.in",
      standard: "none",
    },
  ],
} satisfies Chain
