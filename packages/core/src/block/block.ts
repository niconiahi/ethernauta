import { Address, Bytes, Hash32, Uint, Bytes256, Bytes8, uintSchema, hash32Schema } from "../base";
import { TransactionInfo } from "../transaction";
import { Withdrawal } from "../withdrawal";
import { Input, literal, union } from "valibot";

export const blockTagSchema = union([literal("earliest"), literal("finalized"), literal("safe"), literal("latest"), literal("pending")])
export type BlockTag = Input<typeof blockTagSchema>
export const blockNumberOrTag = union([uintSchema, blockTagSchema])
export type BlockNumberOrTag = Input<typeof blockNumberOrTag>
export const blockNumberOrTagOrHash = union([uintSchema, blockTagSchema, hash32Schema])
export type BlockNumberOrTagOrHash = Input<typeof blockNumberOrTagOrHash>
export interface Block {
  hash: Hash32;
  parentHash: Hash32;
  sha3Uncles: Hash32;
  miner: Address;
  stateRoot: Hash32;
  transactionsRoot: Hash32;
  receiptsRoot: Hash32;
  logsBloom: Bytes256;
  difficulty?: Uint; // Optional as it's not listed in the required fields
  number: Uint;
  gasLimit: Uint;
  gasUsed: Uint;
  timestamp: Uint;
  extraData: Bytes;
  mixHash: Hash32;
  nonce: Bytes8;
  totalDifficulty?: Uint;
  baseFeePerGas?: Uint;
  withdrawalsRoot?: Hash32;
  blobGasUsed?: Uint;
  excessBlobGas?: Uint;
  parentBeaconBlockRoot?: Hash32;
  size: Uint;
  transactions: Hash32[] | TransactionInfo[];
  withdrawals?: Withdrawal[];
  uncles: Hash32[];
}
export interface BadBlock {
  block: Block;
  hash: Hash32;
  rlp: Bytes;
}