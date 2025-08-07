// biome-ignore-all lint: disable Biome linting for this file
import type { Chain } from "../shared"

export const eip155_363 = {
  name: "Theta Sapphire Testnet",
  shortName: "theta-sapphire",
  chain: "Theta",
  rpc: ["https://eth-rpc-api-sapphire.thetatoken.org/rpc"],
  faucets: [],
  nativeCurrency: {
    name: "Theta Fuel",
    symbol: "TFUEL",
    decimals: 18,
  },
  infoURL: "https://www.thetatoken.org/",
  chainId: 363,
  networkId: 363,
  slip44: 1,
  explorers: [
    {
      name: "Theta Sapphire Testnet Explorer",
      url: "https://guardian-testnet-sapphire-explorer.thetatoken.org",
      standard: "EIP3091",
    },
  ],
} satisfies Chain
