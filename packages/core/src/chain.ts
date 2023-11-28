// https://github.com/ChainAgnostic/caip-js

const CHAIN_ID = {
  Mainnet: "eip155:1",
  Localhost: "eip155:539",
  OptimismGoerli: "eip155:420",
} as const;
type ObjectValues<T> = T[keyof T];
export type ChainId = ObjectValues<typeof CHAIN_ID>;
